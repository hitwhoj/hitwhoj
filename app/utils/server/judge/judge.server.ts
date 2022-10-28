import { filter, Subject } from "rxjs";
import WebSocket from "ws";
import { recordFinishSubject, recordUpdateSubject } from "~/utils/serverEvents";
import { db } from "../db.server";
import { s3 } from "../s3.server";
import type {
  AcceptMessage,
  DispatchTask,
  FinishMessage,
  HandshakeMessage,
  Judge2WebMessage,
  JudgeStatus,
  ProgressMessage,
  RejectMessage,
  StatusMessage,
  SyncMessage,
  Web2JudgeMessage,
} from "./judge.types";
import { memorySummary, timeSummary } from "./judge.types";

type JudgeMachineStatus = {
  status: "Online" | "Offline";
  cpus: number;
  occupied: number;
  queue: number;
  langs: string[];
  /** @deprecated */
  "ext-features": string[];
};

export class Judge {
  id: number;
  url: string;

  status: JudgeMachineStatus = {
    status: "Offline",
    cpus: 0,
    occupied: 0,
    queue: 0,
    langs: [],
    "ext-features": [],
  };

  #subject: Subject<Judge2WebMessage> = new Subject();
  #ws: WebSocket | null = null;

  // 分配之后等待响应的任务
  #dispatches: Map<
    number,
    {
      timeout: NodeJS.Timeout;
      resolve: Function;
      reject: Function;
    }
  > = new Map();
  // 分配之后等待结果的任务
  #workings: Map<number, { timeout: NodeJS.Timeout }> = new Map();

  constructor(id: number, ip: string, port: number) {
    this.id = id;
    this.url = `ws://${ip}:${port}/`;

    // 监听握手消息
    this.#subject
      .pipe(filter((data): data is HandshakeMessage => data.type === "hello"))
      .subscribe((data) => {
        // Reject mismatched judge version
        if (data.version !== "v0") {
          this.#ws?.terminate();
          return;
        }

        this.status.status = "Online";
        this.status.cpus = data.cpus;
        this.status.langs = data.langs;
        this.status["ext-features"] = data["ext-features"];
      });

    // 监听状态同步消息
    this.#subject
      .pipe(filter((data): data is StatusMessage => data.type === "status"))
      .subscribe((data) => {
        this.status.cpus = data.cpus;
        this.status.occupied = data.occupied;
        this.status.queue = data.queue;
      });

    // 监听分配任务响应消息
    this.#subject
      .pipe(
        filter(
          (data): data is AcceptMessage | RejectMessage =>
            data.type === "accept" || data.type === "reject"
        )
      )
      .subscribe((data) => {
        const callback = this.#dispatches.get(data.id);
        if (!callback) return;

        this.#dispatches.delete(data.id);
        clearTimeout(callback.timeout);
        if (data.type === "accept") callback.resolve();
        else callback.reject(new Error("Remote rejected"));
      });

    // 监听文件同步消息
    this.#subject
      .pipe(filter((data): data is SyncMessage => data.type === "sync"))
      .subscribe(async (data) => {
        const buffer = await s3.readFile(`/file/${data.uuid}`);
        this.#send({
          type: "sync",
          uuid: data.uuid,
          data: buffer.toString("base64"),
        });
      });

    // 监听评测进度消息
    this.#subject
      .pipe(
        filter(
          (data): data is ProgressMessage | FinishMessage =>
            data.type === "progress" || data.type === "finish"
        )
      )
      .subscribe(async (data) => {
        const callback = this.#workings.get(data.id);
        if (!callback) {
          // 任务已经超时，或者任务已经结束
          return;
        }

        const id = data.id;
        const status = data.result.status;
        const score = data.result.score;
        const message = data.result.message;
        const time = timeSummary(data.result.subtasks);
        const memory = memorySummary(data.result.subtasks);
        const subtasks = data.result.subtasks;

        // 如果任务已经结束就标记为结束
        if (data.type === "finish") {
          this.#workings.delete(data.id);
          clearTimeout(callback.timeout);
          this.status.occupied--;

          // 更新到数据库
          const result = await db.record.update({
            where: { id: data.id },
            data: { status, score, message, time, memory, subtasks },
            select: { id: true },
          });
          // 推送更新
          recordFinishSubject.next(result.id);
        }

        // 推送到事件中心
        recordUpdateSubject.next({
          id,
          status,
          score,
          message,
          time,
          memory,
          subtasks,
        });
      });
  }

  connect() {
    // close the old connection
    this.#ws?.close();

    // start a new connection
    this.#ws = new WebSocket(this.url);
    this.#ws.onopen = () => (this.status.status = "Online");
    this.#ws.onclose = () => (this.status.status = "Offline");
    this.#ws.onmessage = ({ data }) => {
      if (process.env.RUST_LOG === "debug") {
        console.log(`[recieved] ${data.toString()}`);
      }
      try {
        this.#subject.next(JSON.parse(data.toString()));
      } catch (e) {
        console.error(e);
      }
    };
    this.#ws.onerror = (error) => {
      console.error(`[judge] ${error.message}`);
    };
  }

  #send(data: Web2JudgeMessage) {
    if (
      this.#ws?.readyState === WebSocket.OPEN &&
      this.status.status === "Online"
    ) {
      if (process.env.RUST_LOG === "debug") {
        console.log(`[send] ${JSON.stringify(data)}`);
      }
      this.#ws.send(JSON.stringify(data));
    } else {
      console.warn("Trying to send message to offline judge");
    }
  }

  async #mark(id: number, status: JudgeStatus, reason: string) {
    let result = await db.record.update({
      where: { id },
      data: {
        status,
        score: 0,
        message: reason,
        time: -1,
        memory: -1,
        subtasks: [],
      },
      select: {
        id: true,
        status: true,
        score: true,
        message: true,
        time: true,
        memory: true,
        subtasks: true,
      },
    });

    // 推送到事件中心
    recordUpdateSubject.next(result);
  }

  /**
   * 分配任务给评测机。如果评测机拒绝评测，则会 reject
   */
  async dispatch(task: DispatchTask) {
    await new Promise<void>((resolve, reject) => {
      // 5s timeout if client still not response
      const timeout = setTimeout(() => {
        if (this.#dispatches.delete(task.id)) {
          reject(new Error("Dispatch Timeout"));
        }
      }, 5000);
      this.#dispatches.set(task.id, { timeout, resolve, reject });
      this.#send({ type: "task", ...task });
    });

    // 评测超时计时器
    const timeout = setTimeout(() => {
      if (this.#workings.delete(task.id)) {
        this.#mark(task.id, "System Error", "[judge] judge timeout (60s)");
        this.status.occupied--;
      }
    }, 60000);

    // 成功分配给当前的评测机
    this.#workings.set(task.id, { timeout });
    this.status.occupied++;
    this.#mark(task.id, "Judging", "");
  }
}

import { filter, Subject } from "rxjs";
import WebSocket from "ws";
import { recordUpdateSubject } from "~/utils/serverEvents";
import { db } from "../db.server";
import { s3 } from "../s3.server";
import type {
  AcceptMessage,
  DispatchTask,
  FinishMessage,
  HandshakeMessage,
  Judge2WebMessage,
  ProcessMessage,
  RejectMessage,
  StatusMessage,
  SyncMessage,
  Web2JudgeMessage,
} from "./judge.types";
import { memorySummary, timeSummary } from "./judge.types";

type JudgeStatus = {
  status: "Online" | "Offline";
  cpus: number;
  occupied: number;
  queue: number;
  langs: string[];
  /** @deprecated */
  "ext-features": string[];
};

export class Judge {
  status: JudgeStatus = {
    status: "Offline",
    cpus: 0,
    occupied: 0,
    queue: 0,
    langs: [],
    "ext-features": [],
  };

  #subject: Subject<Judge2WebMessage> = new Subject();
  #ws: WebSocket;

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

  constructor(host: string) {
    this.#ws = new WebSocket(`ws://${host}/`);
    this.#ws.on("message", (data) => {
      try {
        this.#subject.next(JSON.parse(data.toString()));
      } catch (e) {
        this.#subject.error(e);
      }
    });
    this.#ws.on("error", (data) => this.#subject.error(data));
    this.#ws.on("close", () => this.#subject.complete());

    // 监听握手消息
    this.#subject
      .pipe(filter((data): data is HandshakeMessage => data.type === "hello"))
      .subscribe((data) => {
        // Reject mismatched judge version
        if (data.version !== "v0") {
          this.#ws.close();
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
        if (data.type === "accept") callback.resolve();
        else callback.reject();
        clearTimeout(callback.timeout);
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
          (data): data is ProcessMessage | FinishMessage =>
            data.type === "process" || data.type === "finish"
        )
      )
      .subscribe(async (data) => {
        const callback = this.#workings.get(data.id);
        if (!callback) {
          // 任务已经超时，或者任务已经结束
          return;
        }

        // 如果任务已经结束就标记为结束
        if (data.type === "finish") {
          this.#workings.delete(data.id);
          clearTimeout(callback.timeout);
          this.status.occupied--;
        }

        // 更新到数据库
        const record = await db.record.update({
          where: { id: data.id },
          data: {
            status: data.result.status,
            score: data.result.score,
            message: data.result.message,
            time: timeSummary(data.result.subtasks),
            memory: memorySummary(data.result.subtasks),
            subtasks: data.result.subtasks,
          },
          select: {
            id: true,
            time: true,
            score: true,
            memory: true,
            status: true,
            message: true,
            subtasks: true,
            contestId: true,
            problemId: true,
            submitterId: true,
          },
        });

        // 推送到事件中心
        recordUpdateSubject.next(record);
      });

    // 监听错误消息
    this.#subject.subscribe({
      error: () => (this.status.status = "Offline"),
      complete: () => (this.status.status = "Offline"),
    });
  }

  #send(data: Web2JudgeMessage) {
    if (this.#ws.readyState === WebSocket.OPEN) {
      this.#ws.send(JSON.stringify(data));
    }
  }

  /**
   * 标记评测任务失败
   */
  async #markAsFailed(id: number, reason: string) {
    const record = await db.record.update({
      where: { id },
      data: {
        status: "System Error",
        score: 0,
        message: reason,
        time: -1,
        memory: -1,
        subtasks: [],
      },
      select: {
        id: true,
        time: true,
        score: true,
        memory: true,
        status: true,
        message: true,
        subtasks: true,
        contestId: true,
        problemId: true,
        submitterId: true,
      },
    });
    // 推送到事件中心
    recordUpdateSubject.next(record);
  }

  /**
   * 分配任务给评测机。如果评测机拒绝评测，则会 reject
   */
  async dispatch(task: DispatchTask) {
    await new Promise<void>((resolve, reject) => {
      // 5s timeout if client still not response
      const timeout = setTimeout(
        () => this.#dispatches.delete(task.id) && reject(),
        5000
      );
      this.#dispatches.set(task.id, { timeout, resolve, reject });
      this.#send({ type: "task", ...task });
    });

    // 评测超时计时器
    const timeout = setTimeout(() => {
      if (this.#workings.delete(task.id)) {
        this.#markAsFailed(task.id, "[judge] judge timeout (60s)");
      }
    }, 60000);

    // 成功分配给当前的评测机
    this.#workings.set(task.id, { timeout });
    this.status.occupied++;
  }
}

import * as io from "socket.io";
import { db } from "./db.server";
import { s3 } from "./s3.server";
import type {
  ClientEvent,
  JudgeRequest,
  JudgeResult,
  ServerEvent,
} from "../types";

/**
 * 后端服务器
 *
 * 后端服务器提供任务分发服务，每个评测机都会主动向后端服务器建立链接，每当后端有新任务（或者有等待评测的任务）时，后端会先广播一个 "task" 数据包给所有评测机，每个评测机如果当前有空余的资源，会自动向后端服务器发送一个 "task" 响应数据包，后端服务器收到响应数据包之后便会分配任务给评测机。
 *
 * 如果考虑到网络有延迟的情况，后端服务器可能会收到同一个评测机发来的多次 "task" 数据包，但由于网络波动，分配到的任务数量可能会大于评测机的资源上限。这时候评测机可以发送 "reject" 数据包告诉后端服务器评测机拒绝接受这项新的任务。
 *
 * ```plain
 * 后端服务器          评测机
 * |------(task 1)------>| 后端收到 Task 1，发送广播 1
 * |------(task 2)------>| 后端收到 Task 2，发送广播 2
 * |<-----(task 1)-------| 评测机收到广播 1，向后端发送 Task 1 ACK
 * |<-----(task 2)-------| 评测机收到广播 2，向后端发送 Task 2 ACK（因为当前资源依然空闲）
 * |----(dispatch 1)---->| 后端分配 Task 1 给评测机，评测机开始评测 Task 1
 * |----(dispatch 2)---->| 后端分配 Task 2 给评测机，然而评测机当前没有空余资源
 * |<----(reject 2)------| 于是评测机向后端发送 Reject 2 报文
 * |------(task 2)------>| 后端收到 Reject 2 报文，重新发送广播 2
 * 之后便由其他评测机接受并评测 Task 2
 * | a few moments later |
 * |<----(finish 2)------| 评测完成，向后端发送 Finish 2 报文
 * ```
 *
 * 考虑评测机超时的情况，后端服务器当分配任务之后启动一个计时器，如果评测机在规定时间内没有发送任何数据包回来，则将评测结果设置为 UnknownError，并且丢弃任何之后收到的关于该任务的数据包。
 */
class JudgeServer {
  // Socket IO 服务器，用于接收来自评测机的链接
  #server = new io.Server<ServerEvent, ClientEvent>();
  // 评测超时定时器
  #timeout = new Map<number, NodeJS.Timeout>();
  // 当前评测任务队列
  #taskQueue: JudgeRequest[] = [];

  constructor() {
    const privateKey = process.env.JUDGE_PRIVATE_KEY;
    const port = parseInt(process.env.JUDGE_PORT || "3000");

    if (!privateKey) {
      console.warn(
        "JUDGE_PRIVATE_KEY is not set, any request will be accepted"
      );
    } else {
      // 验证请求
      this.#server.use((socket, next) => {
        if (socket.handshake.auth.key !== privateKey) {
          socket.disconnect();
          return;
        }
        next();
      });
    }

    this.#server.on("connect", (socket) => {
      // 评测机请求分配任务
      socket.on("task", async () => {
        // 若队列中无任务，则什么也不做
        if (this.#taskQueue.length === 0) {
          return;
        }

        // 发送任务给评测机
        const task = this.#taskQueue.shift()!;
        socket.emit("dispatch", task);

        // 启动超时计时器
        const timeout = setTimeout(async () => {
          // 评测超时
          console.warn(`Task ${task.rid} timed out`);
          this.#timeout.delete(task.rid);

          // 更新数据库，记录超时错误
          await updateDatabase({
            rid: task.rid,
            status: "System Error",
            message:
              "[judge] Judge Timeout\n" +
              "[judge] You can report this issue to Administrator.",
          });
        }, 60000);
        this.#timeout.set(task.rid, timeout);

        console.log(`Task ${task.rid} dispatched`);
        // 任务分配成功，更新数据库
        await updateDatabase({
          rid: task.rid,
          status: "Judging",
          message: "",
        });
      });

      // 评测机返回评测进度更新
      socket.on("result", async (res) => {
        if (!this.#timeout.has(res.rid)) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // 评测结果有更新
        // console.log(`Task ${res.rid} update: ${JSON.stringify(res)}`);
        // 更新数据库
        await updateDatabase(res);
      });

      // 评测机评测完成
      socket.on("finish", async (res) => {
        const timeout = this.#timeout.get(res.rid);
        if (!timeout) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // 清理超时计时器
        clearInterval(timeout);

        // 评测完成
        console.log(`Task ${res.rid} finished`);
        // 更新数据库
        await updateDatabase(res);
      });

      // 评测机拒绝评测任务
      socket.on("reject", (req) => {
        const timeout = this.#timeout.get(req.rid);
        if (!timeout) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // 将评测机拒绝的任务重新放回队列
        this.#pushTask(req);

        // 清理超时计时器
        clearInterval(timeout);
      });

      // 评测机请求获取数据文件
      socket.on("fetch", async (fid) => {
        console.log("fetching", fid);
        const file = await db.file.findUnique({
          where: { id: fid },
          select: { id: true, dataProblemId: true },
        });

        // 如果文件不存在，或者不是题目数据文件，则直接返回
        if (!file || !file.dataProblemId) {
          return;
        }

        const buffer = await s3.readFile(`/file/${file.id}`);
        // 发送文件给评测机
        socket.emit("fetch", fid, buffer);
      });
    });

    // 设置定时广播
    setInterval(() => {
      this.#broadcast();
    }, 1000);

    // 启动服务
    this.#server.listen(port);
    console.log(`Judge server listening on port ${port}`);
  }

  /**
   * 向所有评测机广播目前有待领取的任务
   */
  #broadcast() {
    if (!this.#taskQueue.length) {
      // 没有任务，不广播
      return;
    }

    this.#server.emit("task");
  }

  async #pushTask(task: JudgeRequest) {
    this.#taskQueue.push(task);
    this.#broadcast();

    console.log(`Task ${task.rid} pushed`);
    // 更新数据库
    await updateDatabase({
      rid: task.rid,
      status: "Pending",
      message: "",
    });
  }

  /**
   * 添加新任务
   */
  async push(recordId: number) {
    // 获取评测任务题目的所有数据文件信息
    const record = await db.record.findUnique({
      where: { id: recordId },
      select: {
        language: true,
        problem: {
          select: {
            data: {
              select: {
                id: true,
                filename: true,
              },
            },
          },
        },
      },
    });

    if (!record) {
      return;
    }

    const code = (await s3.readFile(`/record/${recordId}`)).toString("utf8");

    this.#pushTask({
      rid: recordId,
      code,
      language: record.language,
      files: record.problem.data.map(({ id, filename }) => ({
        fid: id,
        filename,
      })),
    });
  }
}

/**
 * 更新数据库
 */
async function updateDatabase(
  res:
    | JudgeResult
    | (Pick<JudgeResult, "status" | "rid" | "message"> &
        Partial<Omit<JudgeResult, "status" | "rid" | "message">>)
) {
  await db.record.update({
    where: { id: res.rid },
    data: {
      status: res.status,
      score: res.score ?? 0,
      time: res.time ?? -1,
      memory: res.memory ?? -1,
      message: res.message,
      subtasks: res.subtasks ?? [],
    },
  });
}

// 下面用于防止开发环境的时候启动多个 JudgeServer

declare global {
  var __judge: JudgeServer | undefined;
}

let judge: JudgeServer;

if (process.env.NODE_ENV === "production") {
  judge = new JudgeServer();
} else {
  if (!global.__judge) {
    global.__judge = new JudgeServer();
  }
  judge = global.__judge;
}

export { judge };

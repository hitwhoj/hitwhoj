import * as io from "socket.io";

/**
 * 客户端向测评机发送的请求
 */
export type JudgeRequest = {
  /**
   * 评测的 Record ID
   */
  rid: number;
};

export enum RecordTestResult {
  Accepted = "Accepted",
  WrongAnswer = "WrongAnswer",
  TimeLimitExceeded = "TimeLimitExceeded",
  MemoryLimitExceeded = "MemoryLimitExceeded",
  RuntimeError = "RuntimeError",
  SystemError = "SystemError",
  Unknown = "Unknown",
}

/**
 * 单个数据点的评测结果
 */
export type JudgeResponse = {
  /**
   * 测试点的分值
   */
  pointId: number;
  /**
   * 测试点结果
   */
  result: RecordTestResult;
  /**
   * 评测结果附加信息
   */
  message: string;
  /**
   * 程序运行时间 (ms)
   */
  time: number;
  /**
   * 程序所使用的内存 (byte)
   */
  memory: number;
};

export interface ServerEvent {
  task: () => void; // 评测机空闲，申请分发任务
  result: (req: JudgeRequest, res: JudgeResponse) => void; // 评测机返回单个测试点结果
  finish: (req: JudgeRequest) => void; // 评测机评测完成
  reject: (req: JudgeRequest) => void; // 评测机拒绝评测
}

export interface ClientEvent {
  task: () => void; // 后端有新任务，发送广播到每个评测机
  dispatch: (req: JudgeRequest) => void; // 后端分配任务给评测机
}

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
  private server = new io.Server<ServerEvent, ClientEvent>();
  private timeout = new Map<number, NodeJS.Timeout>();
  private taskQueue: JudgeRequest[] = [];

  constructor() {
    const privateKey = process.env.JUDGE_PRIVATE_KEY;

    if (!privateKey) {
      console.warn(
        "JUDGE_PRIVATE_KEY is not set, any request will be accepted"
      );
    }

    this.server.use((socket, next) => {
      if (privateKey && socket.handshake.auth.key !== privateKey) {
        socket.disconnect();
        return;
      }
      next();
    });

    this.server.on("connect", (socket) => {
      // 评测机请求分配任务
      socket.on("task", () => {
        // 若队列中无任务，则什么也不做
        if (this.taskQueue.length === 0) {
          return;
        }

        // 发送任务给评测机
        const task = this.taskQueue.shift()!;
        socket.emit("dispatch", task);

        this.timeout.set(
          task.rid,
          setInterval(() => {
            // TODO: 评测超时
            console.log("timeout", task);
            this.timeout.delete(task.rid);
          }, 60000)
        );
      });

      // 评测机返回单个测试点结果
      socket.on("result", (req, res) => {
        if (!this.timeout.has(req.rid)) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // TODO: 记录单点评测结果
        console.log("result", res);
      });

      // 评测机评测完成
      socket.on("finish", (req) => {
        const timeout = this.timeout.get(req.rid);
        if (!timeout) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // TODO: 评测完成
        console.log("finish", req);

        // 清理超时计时器
        clearInterval(timeout);
      });

      // 评测机拒绝评测任务
      socket.on("reject", (req) => {
        const timeout = this.timeout.get(req.rid);
        if (!timeout) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // 将评测机拒绝的任务重新放回队列
        this.push(req);

        // 清理超时计时器
        clearInterval(timeout);
      });
    });

    // 设置定时广播
    setInterval(() => {
      this.broadcast();
    }, 1000);
  }

  /**
   * 向所有评测机广播目前有待领取的任务
   */
  private broadcast() {
    if (!this.taskQueue.length) {
      // 没有任务，不广播
      return;
    }

    this.server.sockets.sockets.forEach((socket) => {
      socket.emit("task");
    });
  }

  /**
   * 添加新任务
   */
  push(task: JudgeRequest) {
    this.taskQueue.push(task);
    this.broadcast();
  }
}

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

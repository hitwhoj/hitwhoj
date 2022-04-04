import * as io from "socket.io";
import { db } from "./db.server";
import { s3 } from "./s3.server";

// 客户端向测评机发送的请求
export type JudgeRequest = {
  rid: number; // 当前任务 id
  code: string; // 选手代码
  language: string; // 选手选择的语言
  files: {
    fid: string;
    filename: string;
  }[]; // 评测所需要的所有文件
};

// 单点评测的结果
export type TaskStatus =
  | "Pending" // 等待中
  | "Running" // 运行中
  | "Accepted" // 正确
  | "WrongAnswer" // 错误答案
  | "TimeLimitExceeded" // 超时
  | "MemoryLimitExceeded" // 超内存
  | "RuntimeError" // 运行时错误（返回值不是 0）
  | "SystemError" // 系统错误（比如没有找到文件，题目配置错误等）
  | "UnknownError" // 未知错误（评测机遇到了未知的问题）
  | "Skipped"; // 跳过（子任务前面已经出错）

// 单个数据点的评测结果
export type TaskResult = {
  status: TaskStatus; // 测试点结果
  message: string; // 评测结果附加信息
  time: number; // 程序运行时间 (ms)
  memory: number; // 程序所使用的内存 (byte)
};

// 子任务的评测结果
export type SubtaskResult = {
  score: number; // 子任务总分（不是具体得到的分数，具体得分会根据子任务评测结果计算）
  message: string; // 子任务附加信息（如果有）
  tasks: TaskResult[]; // 子任务的评测结果
};

// 评测结果
export type JudgeResult = {
  rid: number; // 任务 id
  message: string; // 评测附加信息，包括编译器输出和 SPJ 的输出信息等
  subtasks?: SubtaskResult[]; // 每个测试点的评测结果，如果不提供这个字段说明是编译错误！！！
};

// 评测机发送给网站的事件
export interface ServerEvent {
  task: () => void; // 评测机空闲，申请分发任务
  result: (res: JudgeResult) => void; // 更新评测结果
  finish: (res: JudgeResult) => void; // 评测机评测完成，返回最终结果
  reject: (req: JudgeRequest) => void; // 评测机拒绝评测
  fetch: (fid: string) => void; // 评测机同步文件
}

// 网站向评测机发送的事件
export interface ClientEvent {
  task: () => void; // 后端有新任务，发送广播到每个评测机
  dispatch: (req: JudgeRequest) => void; // 后端分配任务给评测机
  fetch: (fid: string, buffer: Buffer) => void; // 后端同步文件
}

// ==== 以上为评测机通信的接口 ====
// ==== 以下为评测机的实现 ====

export type SubtaskStatus =
  | "Pending" // 等待中
  | "Running" // 运行中
  | "Accepted" // 正确
  | "WrongAnswer" // 错误答案
  | "TimeLimitExceeded" // 超时
  | "MemoryLimitExceeded" // 超内存
  | "RuntimeError" // 运行时错误（返回值不是 0）
  | "SystemError" // 系统错误（比如没有找到文件，题目配置错误等）
  | "UnknownError"; // 未知错误（评测机遇到了未知的问题）

// 评测结果
export type JudgeStatus =
  | "Pending" // 等待中
  | "Compiling" // 编译中
  | "CompileError" // 编译错误
  | "Running" // 运行中
  | "Accepted" // 正确
  | "WrongAnswer" // 错误答案
  | "TimeLimitExceeded" // 超时
  | "MemoryLimitExceeded" // 超内存
  | "RuntimeError" // 运行时错误（返回值不是 0）
  | "SystemError" // 系统错误（比如没有找到文件，题目配置错误等）
  | "UnknownError"; // 未知错误（评测机遇到了未知的问题）

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
      socket.on("task", () => {
        // 若队列中无任务，则什么也不做
        if (this.#taskQueue.length === 0) {
          return;
        }

        // 发送任务给评测机
        const task = this.#taskQueue.shift()!;
        socket.emit("dispatch", task);

        // 启动超时计时器
        const timeout = setTimeout(() => {
          // TODO: 评测超时
          console.log(`Task ${task.rid} timed out`);
          // 异步更新数据库
          updateDatabase(
            {
              rid: task.rid,
              message:
                "[JudgeServer] Judge Timeout\n[JudgeServer] You can report this issue to Administrator.",
              subtasks: [],
            },
            "SystemError"
          );

          this.#timeout.delete(task.rid);
        }, 60000);
        this.#timeout.set(task.rid, timeout);

        console.log(`Task ${task.rid} dispatched`);
        // 任务分配成功，将状态改成 Compiling
        updateDatabase(
          {
            rid: task.rid,
            message: "",
            subtasks: [],
          },
          "Compiling"
        );
      });

      // 评测机返回评测进度更新
      socket.on("result", (res) => {
        if (!this.#timeout.has(res.rid)) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // TODO: 评测结果有更新
        console.log(`Task ${res.rid} update: ${JSON.stringify(res)}`);
        // 异步更新数据库
        updateDatabase(res);
      });

      // 评测机评测完成
      socket.on("finish", (res) => {
        const timeout = this.#timeout.get(res.rid);
        if (!timeout) {
          // 任务已经过期，直接忽略该结果
          return;
        }

        // TODO: 评测完成
        console.log(`Task ${res.rid} finished: ${JSON.stringify(res)}`);
        // 异步更新数据库
        updateDatabase(res);

        // 清理超时计时器
        clearInterval(timeout);
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
        const file = await db.file.findUnique({
          where: { fid },
          select: { pid: true, private: true, fid: true },
        });

        // 如果文件不存在，或者不是题目数据文件，则直接返回
        if (!file || !(file.pid && file.private)) {
          return;
        }

        const buffer = await s3.readFileAsBuffer(
          `/problem/${file.pid}/${file.fid}`
        );
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

  #pushTask(task: JudgeRequest) {
    this.#taskQueue.push(task);
    this.#broadcast();

    // TODO: 加入队伍，开始等待评测机认领
    console.log(`Task ${task.rid} pushed`);
    updateDatabase(
      {
        rid: task.rid,
        message: "",
        subtasks: [],
      },
      "Pending"
    );
  }

  /**
   * 添加新任务
   */
  async push(rid: number) {
    // 获取评测任务题目的所有数据文件信息
    const record = await db.record.findUnique({
      where: { rid },
      select: {
        language: true,
        problem: {
          select: {
            files: {
              where: { private: true },
              select: {
                fid: true,
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

    const code = (await s3.readFileAsBuffer(`/record/${rid}`)).toString("utf8");

    this.#pushTask({
      rid,
      code,
      language: record.language,
      files: record.problem.files,
    });
  }
}

/**
 * 判断 Subtask 的状态
 */
function analyzeSubtaskStatus(subtask: SubtaskResult): SubtaskStatus {
  const tasks = subtask.tasks.map((task) => task.status);

  // 如果全都为 Pending，则为 Pending
  if (tasks.every((status) => status === "Pending")) {
    return "Pending";
  }

  // 如果有至少一个不是 Pending，但是仍然存在 Pending 或者 Running，则为 Running
  if (tasks.some((status) => status === "Pending" || status === "Running")) {
    return "Running";
  }

  // 如果全都为 Accepted，则为 Accepted
  if (tasks.every((status) => status === "Accepted")) {
    return "Accepted";
  }

  // 否则返回第一个不是 Accepted 的状态
  return tasks.find((status) => status !== "Accepted") as SubtaskStatus;
}

/**
 * 判断评测任务的状态
 */
function analyzeStatus(subtasks?: SubtaskResult[]): JudgeStatus {
  if (!subtasks) {
    return "CompileError";
  }

  const tasks = subtasks.map((subtask) => analyzeSubtaskStatus(subtask));

  // 如果有一个为 Pending 或者 Running，则为 Running
  if (tasks.some((status) => status === "Pending" || status === "Running")) {
    return "Running";
  }

  // 如果全都为 Accepted，则为 Accepted
  if (tasks.every((status) => status === "Accepted")) {
    return "Accepted";
  }

  // 否则返回第一个不是 Accepted 的状态
  return tasks.find((status) => status !== "Accepted") as JudgeStatus;
}

function analyzeScore(subtasks: SubtaskResult[]) {
  return subtasks
    .map((subtask) =>
      subtask.tasks.every((task) => task.status === "Accepted")
        ? subtask.score
        : 0
    )
    .reduce((a, b) => a + b, 0);
}

function analyzeTime(subtasks: SubtaskResult[]) {
  return subtasks
    .map((subtask) => subtask.tasks.map((task) => task.time))
    .flat()
    .reduce((a, b) => a + b, 0);
}

function analyzeMemory(subtasks: SubtaskResult[]) {
  return Math.max(
    ...subtasks
      .map((subtask) => subtask.tasks.map((task) => task.memory))
      .flat()
  );
}

/**
 * 更新数据库
 */
function updateDatabase(
  res: JudgeResult,
  status: JudgeStatus = analyzeStatus(res.subtasks)
) {
  const score = res.subtasks ? analyzeScore(res.subtasks) : 0;
  const time = res.subtasks ? analyzeTime(res.subtasks) : 0;
  const memory = res.subtasks ? analyzeMemory(res.subtasks) : 0;

  return db.record.update({
    where: { rid: res.rid },
    data: {
      status,
      score,
      time,
      memory,
      message: res.message,
      subtasks: JSON.stringify(res.subtasks),
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

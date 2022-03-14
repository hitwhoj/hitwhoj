import * as io from "socket.io";

// you only need to create an instance of the client
// and use it in the api functions

export interface ServerEvent {
  getTask: () => void;
  result: (result: JudgeResponse) => void;
  finish: (reqId: string) => void;
}

export interface ClientEvent {
  haveTask: () => void;
  task: (req: JudgeRequest) => void;
}

//客户端向测评机发送的请求
export type JudgeRequest = {
  id: string;
  problemId: string;
  filename: string;
};
//测评机的回复
export type JudgeResponse = {
  pointId: number;
  result: RecordTestResult;
  // message: string;
  time: number;
  memory: number;
};

export type RecordTestResult =
  | "Accepted"
  | "Wrong Answer"
  | "Time Limit Exceed"
  | "Memory Limit Exceed"
  | "Compile Error"
  | "Unknown Error";

// const DEFAULT_TIMEOUT: number = 10000;
// const DEFAULT_REQ_INTERVAL: number = 1000;
// const DEFAULT_FAILURE_TIMES: number = 10;

export type ServerInfo = {
  host: string;
  port: number;
};

// @ts-ignore
class JudgeServer {
  privateKey: string;
  server: io.Server;
  clients: Map<string, io.Socket>;
  taskQueue: JudgeRequest[] = [];
  timer: NodeJS.Timeout | null = null;
  handleResult: (res: JudgeResponse) => void; //处理测评结果的回调
  handleEnd: (reqId: string) => void; //处理测评结束的回调

  constructor(
    privateKey: string,
    handleResult: (res: JudgeResponse) => void,
    handleEnd: (reqId: string) => void
  ) {
    this.privateKey = privateKey;
    this.handleResult = handleResult;
    this.handleEnd = handleEnd;
    this.clients = new Map();
    this.server = new io.Server<ServerEvent, ClientEvent>();
    this.server.use((socket, next) => {
      if (socket.handshake.auth.key !== this.privateKey) {
        socket.disconnect();
        return;
      }
      next();
    });
    this.server.on("connect", (socket) => {
      // add socket in map
      this.clients.set(socket.id, socket);
      // remove socket from map when disconnect
      socket.on("disconnect", () => {
        this.clients.delete(socket.id);
      });
      // when socket want to get a task
      socket.on("getTask", () => {
        // 若队列中无任务，则返回
        if (this.taskQueue.length === 0) {
          return;
        }

        // 发送任务
        const task = this.taskQueue.shift();
        socket.emit("task", task);

        // 发送任务后没有任务，则停止计时器
        if (this.taskQueue.length === 0) {
          clearInterval(<NodeJS.Timeout>this.timer);
        }
      });
      socket.on("result", (res) => {
        this.handleResult(res);
      });
      socket.on("finish", (id) => {
        this.handleEnd(id);
      });
      socket.on("error", (err) => {
        console.log(err);
      });
    });
  }

  send(req: JudgeRequest) {
    // 若此时队列中无任务，则开启计时器，定时广播任务
    if (this.taskQueue.length === 0) {
      this.timer = setInterval(() => {
        console.log("server emit haveTask");
        this.server.emit("haveTask");
      }, 1000);
    }

    // 任务加入队列
    this.taskQueue.push(req);
  }

  start(port: number) {
    this.clients = new Map();
    this.server.listen(port);
    console.log("server start at port " + port);
  }
}

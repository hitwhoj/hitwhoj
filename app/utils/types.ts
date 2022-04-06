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
  | "OutputLimitExceeded" // 超输出
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
  status: SubtaskStatus; // 子任务状态
  score: number; // 子任务总分（不是具体得到的分数，具体得分会根据子任务评测结果计算）
  message: string; // 子任务附加信息（如果有）
  time: number; // 子任务运行时间总和 (ms)
  memory: number; // 子任务所使用的内存最大值 (byte)
  tasks: TaskResult[]; // 子任务的评测结果
};

// 评测结果
export type JudgeResult = {
  rid: number; // 任务 id
  score: number; // 总分
  status: JudgeStatus; // 任务结果
  message: string; // 评测附加信息，包括编译器输出和 SPJ 的输出信息等
  time: number; // 子任务运行时间总和 (ms)
  memory: number; // 子任务所使用的内存最大值 (byte)
  subtasks: SubtaskResult[]; // 每个测试点的评测结果，如果甚至没有开始评测，则为空数组
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
  | "Judging" // 评测中（已经分配给了评测机）
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

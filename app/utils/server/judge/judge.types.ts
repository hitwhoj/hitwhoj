export type TaskStatus =
  | "Pending" // 测试点还在排队
  | "Running" // 测试点正在运行
  | "Skipped" // 子任务中出现第一个非 Accepted 测试点之后，剩余的所有测试点都直接跳过
  | "Accepted" // 程序通过该测试点
  | "Wrong Answer" // 程序正常运行结束，但是输出的结果与标准结果不匹配，或者无法通过 SPJ 的校验
  | "Time Limit Exceeded" // 程序无法在规定的时间限制内运行结束
  | "Memory Limit Exceeded" // 程序运行过程中超过内存限制，或者因为超过运行内存而终止
  | "Runtime Error" // 程序运行过程中出现其他非正常终止状况，或者程序运行结束返回值不为 0
  | "System Error"; // 评测遇到非预期的情况

export type SubtaskStatus =
  | "Pending" // 子任务还在排队（没有进行任何编译或者运行）
  | "Running" // 子任务中的其中一个测试点正在运行
  | "Accepted" // 程序通过子任务中的全部测试点
  | "Wrong Answer" // 第一个非 Accepted 测试点的状态为 Wrong Answer
  | "Time Limit Exceeded" // 第一个非 Accepted 测试点的状态为 Time Limit Exceeded
  | "Memory Limit Exceeded" // 第一个非 Accepted 测试点的状态为 Memory Limit Exceeded
  | "Runtime Error" // 第一个非 Accepted 测试点的状态为 Runtime Error
  | "System Error"; // 评测遇到非预期的情况

export type JudgeStatus =
  | "Pending" // 任务还在排队
  | "Judging" // 任务已经被成功分配给了评测机
  | "Compiling" // 任务正在编译
  | "Running" // 任务正在运行
  | "Compile Error" // 程序编译时遇到了错误
  | "Accepted" // 程序通过全部子任务
  | "Wrong Answer" // 程序第一个非 Accepted 子任务的结果为 Wrong Answer
  | "Time Limit Exceeded" // 程序第一个非 Accepted 子任务的结果为 Time Limit Exceeded
  | "Memory Limit Exceeded" // 程序第一个非 Accepted 子任务的结果为 Memory Limit Exceeded
  | "Runtime Error" // 程序第一个非 Accepted 子任务的结果为 Runtime Error
  | "System Error"; // 评测遇到非预期的情况

export type TaskResult = {
  /** SPJ 输出的内容 */
  message: string;
  /** 测试点的状态 */
  status: TaskStatus;
  /** 运行时间，单位为 ms，如果没有结果则为 -1 */
  time: number;
  /** 内存使用量，单位为 byte，如果没有结果则为 -1 */
  memory: number;
};

export type SubtaskResult = {
  /** 子任务说明内容 */
  message: string;
  /** 子任务状态 */
  status: SubtaskStatus;
  /** 子任务得分 */
  score: number;
  /** 所有测试点结果 */
  tasks: TaskResult[];
};

export type JudgeResult = {
  /** 编译器的输出内容 */
  message: string;
  /** 评测状态 */
  status: JudgeStatus;
  /** 评测机得分，等于所有 Accepted 子任务的得分总和。 */
  score: number;
  /** 所有子任务结果 */
  subtasks: SubtaskResult[];
};

export type HandshakeMessage = {
  type: "hello";
  version: string;
  cpus: number;
  langs: string[];
  /** @deprecated */
  "ext-features": string[];
};

export type StatusMessage = {
  type: "status";
  cpus: number;
  occupied: number;
  queue: number;
};

export type AssignMessage = {
  type: "task";
  id: number;
  code: string;
  language: string;
  files: Record<string, string>;
};

export type AcceptMessage = {
  type: "accept";
  id: number;
};

export type RejectMessage = {
  type: "reject";
  id: number;
};

export type SyncMessage = {
  type: "sync";
  uuid: string;
};

export type SyncResponseMessage = {
  type: "sync";
  uuid: string;
  data: string;
};

export type ProcessMessage = {
  type: "process";
  id: number;
  result: JudgeResult;
};

export type FinishMessage = {
  type: "finish";
  id: number;
  result: JudgeResult;
};

export type Web2JudgeMessage = AssignMessage | SyncResponseMessage;
export type Judge2WebMessage =
  | HandshakeMessage
  | StatusMessage
  | AcceptMessage
  | RejectMessage
  | SyncMessage
  | ProcessMessage
  | FinishMessage;

export type DispatchTask = {
  id: number;
  code: string;
  language: string;
  files: Record<string, string>;
};

export type ConfigTaskDefault = {
  input: string;
  output: string;
  time?: number;
  memory?: number;
};

export type ConfigTaskDynamic = {
  args: string;
  time?: number;
  memory?: number;
};

export type ConfigSubtask<T> = {
  score: number;
  time?: number;
  memory?: number;
  cases: T[];
};

export type ConfigJson =
  | {
      type: "default";
      checkerType?: "default" | "testlib";
      checkerName?: string;
      time?: number;
      memory?: number;
      subtasks: ConfigSubtask<ConfigTaskDefault>[];
    }
  | {
      type: "interactive";
      interactive: string;
      time?: number;
      memory?: number;
    }
  | {
      type: "submit_answer";
      answer: string;
    }
  | {
      type: "dynamic";
      mkdata: string;
      std: string;
      checkerType?: "default" | "testlib";
      checkerName?: string;
      time?: number;
      memory?: number;
      subtasks: ConfigSubtask<ConfigTaskDefault | ConfigTaskDynamic>[];
    };

export function timeSummary(subtasks: SubtaskResult[]) {
  return subtasks.reduce((sum, subtask) => {
    const tasktimes = subtask.tasks.reduce((sum, task) => {
      return sum + Math.max(task.time, 0);
    }, 0);
    return sum + tasktimes;
  }, 0);
}

export function memorySummary(subtasks: SubtaskResult[]) {
  return subtasks.reduce((max, subtask) => {
    const tasktimes = subtask.tasks.reduce((max, task) => {
      return Math.max(max, task.time);
    }, 0);
    return Math.max(max, tasktimes);
  }, 0);
}

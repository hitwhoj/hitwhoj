import { db } from "../db.server";
import { s3 } from "../s3.server";
import { Judge } from "./judge.server";
import type { DispatchTask } from "./judge.types";

export class JudgeManager {
  #judges: Judge[] = [];
  #queue: DispatchTask[] = [];

  constructor() {
    // TODO 动态添加评测机
    this.addJudge("127.0.0.1:1145");

    setInterval(() => {
      this.#dispatch();
    }, 1000);
  }

  /** 添加新的评测机 */
  addJudge(host: string) {
    const judge = new Judge(host);
    this.#judges.push(judge);
  }

  /** 添加新的评测任务 */
  async push(id: number) {
    const record = await db.record.findUnique({
      where: { id },
      select: {
        language: true,
        problem: { select: { data: { select: { id: true, filename: true } } } },
      },
    });

    if (!record) throw new Error("Record not found");

    const code = (await s3.readFile(`/record/${id}`)).toString("utf-8");

    this.#queue.push({
      id,
      code,
      language: record.language,
      files: record.problem.data.reduce(
        (files, { filename, id }) => ({
          ...files,
          [filename]: id,
        }),
        {}
      ),
    });

    // 统一由 Interval 去触发
    // this.#dispatch();
  }

  async #dispatch() {
    // consume all missions at a time
    const queue: DispatchTask[] = [];
    while (this.#queue.length > 0) {
      queue.push(this.#queue.shift()!);
    }

    for (const mission of queue) {
      const judges = this.#judges.filter((judge) =>
        judge.status.langs.includes(mission.language)
      );

      let dispatched = false;
      for (const judge of judges) {
        // judge is full
        if (judge.status.occupied >= judge.status.cpus) continue;

        // try to dispatch to the certain judge
        try {
          await judge.dispatch(mission);
          dispatched = true;
          break;
        } catch (_) {}
      }

      // recycle dispatched missions
      if (!dispatched) {
        this.#queue.push(mission);
      }
    }
  }
}

// =========================

let judge: JudgeManager;

declare global {
  var __judge: JudgeManager | undefined;
}

if (process.env.NODE_ENV === "production") {
  judge = new JudgeManager();
} else {
  if (!global.__judge) {
    global.__judge = new JudgeManager();
  }
  judge = global.__judge;
}

export { judge };

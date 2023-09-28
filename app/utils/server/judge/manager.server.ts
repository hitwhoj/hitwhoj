import { db } from "../db.server";
import { s3 } from "../s3.server";
import { Judge } from "./judge.server";
import type { DispatchTask } from "./judge.types";

export class JudgeManager {
  #judges: Judge[] = [];
  #queue: DispatchTask[] = [];

  constructor() {
    this.initializeJudge();

    setInterval(() => {
      this.#dispatch();
    }, 3000);

    setInterval(() => {
      for (const judge of this.#judges) {
        if (judge.status.status === "Offline") {
          judge.connect();
        }
      }
    }, 180_000);
  }

  /** 从数据库中加载评测机 */
  async initializeJudge() {
    console.log("Loading judges from Database");

    const judges = await db.judge.findMany({
      select: { id: true, ip: true, port: true },
    });

    for (const { id, ip, port } of judges) {
      const judge = new Judge(id, ip, port);
      this.#judges.push(judge);

      console.log(`Connecting to ws://${ip}:${port}/`);
      judge.connect();
    }

    const records = await db.record.findMany({
      where: { status: "Pending" },
      orderBy: { id: "desc" },
      select: { id: true },
    });

    console.log(`Rejudge ${records.length} tasks`);

    for (const record of records) {
      await this.push(record.id);
    }
  }

  getState() {
    return this.#judges.map((judge) => ({
      id: judge.id,
      state: judge.status,
    }));
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
        // judge is offline or full
        if (
          judge.status.status === "Offline" ||
          judge.status.occupied >= judge.status.cpus
        ) {
          continue;
        }

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

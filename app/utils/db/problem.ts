import { db } from "~/utils/server/db.server";

// 这真是太优美了
type ProblemWhereInput = NonNullable<
  NonNullable<Parameters<typeof db.problem.findMany>["0"]>["where"]
>;

/**
 * 筛选题目，会选中题单列表中需要的属性
 *
 * 通过 where 来过滤题目
 */
export async function findProblemMany(where: ProblemWhereInput) {
  return await db.problem.findMany({
    where,
    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      private: true,
      team: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

/** 首页题单的数据格式 */
export type ProblemList = Awaited<ReturnType<typeof findProblemMany>>;

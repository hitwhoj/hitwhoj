import { db } from "../server/db.server";
import type { Unpack } from "../tools";

// 这真是太优美了
type ContestWhereInput = NonNullable<
  NonNullable<Parameters<typeof db.contest.findMany>["0"]>["where"]
>;

/**
 * 筛选比赛，自动过滤掉团队的比赛
 */
export function findContestList(where: ContestWhereInput) {
  return db.contest.findMany({
    where: { teamId: null, ...where },
    orderBy: [{ beginTime: "desc" }],
    select: {
      id: true,
      title: true,
      beginTime: true,
      endTime: true,
      system: true,
      private: true,
      tags: {
        orderBy: { name: "asc" },
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          attendees: true,
        },
      },
    },
  });
}

export type ContestListData = Unpack<
  Awaited<ReturnType<typeof findContestList>>
>;

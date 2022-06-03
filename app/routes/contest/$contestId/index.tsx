import { Descriptions, Typography } from "@arco-design/web-react";
import type { Contest, ContestTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Markdown } from "~/src/Markdown";

type LoaderData = {
  contest: Pick<
    Contest,
    "id" | "title" | "description" | "beginTime" | "endTime"
  > & {
    tags: Pick<ContestTag, "name">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      description: true,
      beginTime: true,
      endTime: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return {
    contest,
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
  description: data?.contest.description,
});

export default function ContestIndex() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Descriptions
        column={1}
        title="比赛信息"
        data={[
          {
            label: "开始时间",
            value: new Intl.DateTimeFormat("zh-CN", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(contest.beginTime)),
          },
          {
            label: "结束时间",
            value: new Intl.DateTimeFormat("zh-CN", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(contest.endTime)),
          },
          {
            label: "比赛时长",
            value: `${
              (new Date(contest.endTime).getTime() -
                new Date(contest.beginTime).getTime()) /
              3600_000
            } 小时`,
          },
        ]}
        labelStyle={{ paddingRight: 36 }}
      />
      <Markdown>{contest.description}</Markdown>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

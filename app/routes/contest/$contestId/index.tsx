import { Space, Table, Tag } from "@arco-design/web-react";
import type { Contest, ContestTag, Problem, Team } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  contest: Contest & {
    tags: ContestTag[];
    problems: Pick<Problem, "id" | "title">[];
    team: Pick<Team, "id" | "name"> | null;
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const contestId = invariant(idScheme.safeParse(params.contestId), {
    status: 404,
  });

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    include: {
      tags: true,
      team: {
        select: {
          id: true,
          name: true,
        },
      },
      problems: {
        select: {
          id: true,
          title: true,
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

function Time({ contest }: { contest: Contest }) {
  const begin = new Date(contest.beginTime);
  const end = new Date(contest.endTime);
  return (
    <p>
      起止时间：{" "}
      <time dateTime={begin.toISOString()}>{begin.toLocaleString()}</time>
      {" ~ "}
      <time dateTime={end.toISOString()}>{end.toLocaleString()}</time>
    </p>
  );
}

function ContestTags({ tags }: { tags: ContestTag[] }) {
  return tags.length ? (
    <Space size="medium">
      {tags.map((tag) => (
        <Link to={`/contest/tag/${tag.name}`} key={tag.name}>
          <Tag>#{tag.name}</Tag>
        </Link>
      ))}
    </Space>
  ) : (
    <div>没有标签捏</div>
  );
}

function ContestProblemList({
  problems,
}: {
  problems: Pick<Problem, "id" | "title">[];
}) {
  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      render: (id: string) => <Link to={`/problem/${id}`}>{id}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, problem: Pick<Problem, "id" | "title">) => (
        <Link to={`/problem/${problem.id}`}>{title}</Link>
      ),
    },
  ];
  return <Table columns={tableColumns} data={problems} pagination={false} />;
}

export default function ContestIndex() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <>
      <Time contest={contest} />
      <p>{contest.description}</p>
      <p>
        Belong To Team:{" "}
        {contest.team && (
          <Link to={`/team/${contest.team.id}`}>{contest.team.name}</Link>
        )}
      </p>
      <h2>标签</h2>
      <ContestTags tags={contest.tags} />
      <h2>题目</h2>
      <ContestProblemList problems={contest.problems} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import { Contest } from "@prisma/client";
import { LoaderFunction, json, useLoaderData, MetaFunction, Link } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  contests: Pick<Contest, "cid" | "title" | "beginTime" | "endTime">[];
};

export const loader: LoaderFunction = async () => {
  const contests = await db.contest.findMany({
    orderBy: [{ cid: "asc" }],
    take: 20,
    select: {
      cid: true,
      title: true,
      beginTime: true,
      endTime: true,
    },
  });

  return json({ contests });
};

export const meta: MetaFunction = () => ({
  title: "Contest List",
});

export function ContestState({ begin, end }: { begin: Date; end: Date }) {
  if (end.getTime() < Date.now()) {
    return (
      <span
        style={{
          color: "white",
          backgroundColor: "red",
          borderRadius: "10px",
          margin: "0 10px",
          padding: "0 10px",
        }}
      >
        已结束
      </span>
    );
  } else if (begin.getTime() > Date.now()) {
    return (
      <span
        style={{
          color: "white",
          backgroundColor: "blue",
          borderRadius: "10px",
          margin: "0 10px",
          padding: "0 10px",
        }}
      >
        未开始
      </span>
    );
  } else {
    return (
      <span
        style={{
          color: "white",
          backgroundColor: "green",
          borderRadius: "10px",
          margin: "0 10px",
          padding: "0 10px",
        }}
      >
        进行中
      </span>
    );
  }
}

export function ContestList({
  contests,
}: {
  contests: Pick<Contest, "cid" | "title" | "beginTime" | "endTime">[];
}) {
  return (
    <ul>
      {contests.map((contest) => (
        <li key={contest.cid}>
          <span
            style={{
              color: "grey",
              marginRight: "10px",
            }}
          >
            C{contest.cid}
          </span>
          <Link to={`/contest/${contest.cid}`}>{contest.title}</Link>
          <ContestState
            begin={new Date(contest.beginTime)}
            end={new Date(contest.endTime)}
          />
        </li>
      ))}
    </ul>
  );
}

export default function ContestListIndex() {
  const { contests } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Contest List</h1>
      <Link to="new">
        <button>创建比赛</button>
      </Link>
      <ContestList contests={contests} />
    </>
  );
}

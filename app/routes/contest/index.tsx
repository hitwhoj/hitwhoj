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

export function State({
  beginTime,
  endTime,
}: {
  beginTime: Date;
  endTime: Date;
}) {
  const begin = new Date(beginTime);
  const end = new Date(endTime);
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

export function List({
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
          <State beginTime={contest.beginTime} endTime={contest.endTime} />
        </li>
      ))}
    </ul>
  );
}

export default function ContestList() {
  const { contests } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Contest List</h1>
      <Link to="new">
        <button>创建比赛</button>
      </Link>
      <List contests={contests} />
    </>
  );
}

import { Contest, ProblemSet } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { checkUserReadPermission } from "../__permission";

type LoaderData = {
  createdProblemSets: Pick<ProblemSet, "id" | "title">[];
  createdContests: Pick<Contest, "id" | "title">[];
  attendedContests: Pick<Contest, "id" | "title">[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  await checkUserReadPermission(request);

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      createdProblemSets: {
        where: {
          private: false,
        },
        select: {
          id: true,
          title: true,
        },
      },
      createdContests: {
        select: {
          id: true,
          title: true,
        },
      },
      attendedContests: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return user;
};

export default function UserStatistics() {
  const { createdProblemSets, createdContests, attendedContests } =
    useLoaderData<LoaderData>();

  return (
    <>
      <h2>创建的题单</h2>
      {createdProblemSets.length ? (
        <ul>
          {createdProblemSets.map((problemset) => (
            <li key={problemset.id}>
              <Link to={`/problemset/${problemset.id}`}>
                {problemset.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>没有喵</div>
      )}

      <h2>创建的比赛</h2>
      {createdContests.length ? (
        <ul>
          {createdContests.map((contest) => (
            <li key={contest.id}>
              <Link to={`/contest/${contest.id}`}>{contest.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>没有喵</div>
      )}

      <h2>参与的比赛</h2>
      {attendedContests.length ? (
        <ul>
          {attendedContests.map((contest) => (
            <li key={contest.id}>
              <Link to={`/contest/${contest.id}`}>{contest.title}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>没有喵</div>
      )}
    </>
  );
}

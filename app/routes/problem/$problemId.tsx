import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findProblemPrivacy, findProblemTeam } from "~/utils/db/problem";
import { HiOutlineEyeOff, HiOutlineTag, HiOutlineX } from "react-icons/hi";

export async function loader({ request, params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  const team = self.team(await findProblemTeam(problemId));
  await team.checkPermission(
    (await findProblemPrivacy(problemId))
      ? Permissions.PERM_VIEW_PROBLEM
      : Permissions.PERM_VIEW_PROBLEM_PUBLIC
  );
  const [hasEditPerm] = await team.hasPermission(Permissions.PERM_EDIT_PROBLEM);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
      allowSubmit: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem, hasEditPerm });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题目: ${data?.problem.title} - HITwh OJ`,
  description: data?.problem.description,
});

export default function ProblemView() {
  const { problem, hasEditPerm } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>{problem.title}</h1>

      {(problem.tags.length > 0 || problem.private) && (
        <div className="flex not-prose gap-2">
          {problem.private && (
            <span className="badge badge-warning gap-1">
              <HiOutlineEyeOff />
              <span>隐藏</span>
            </span>
          )}
          {!problem.allowSubmit && (
            <span className="badge badge-error gap-1">
              <HiOutlineX />
              <span>禁止提交</span>
            </span>
          )}
          {problem.tags.map((tag) => (
            <Link
              className="badge gap-1"
              to={`/problem/tag/${tag.name}`}
              key={tag.name}
            >
              <HiOutlineTag />
              <span>{tag.name}</span>
            </Link>
          ))}
        </div>
      )}

      <p className="tabs tabs-boxed bg-base-100 not-prose">
        <NavLink className="tab" to="desc">
          题面
        </NavLink>
        <NavLink className="tab" to="submit">
          提交
        </NavLink>
        {hasEditPerm && (
          <NavLink className="tab" to="data">
            数据
          </NavLink>
        )}
        {hasEditPerm && (
          <NavLink className="tab" to="edit">
            编辑
          </NavLink>
        )}
      </p>

      <Outlet />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

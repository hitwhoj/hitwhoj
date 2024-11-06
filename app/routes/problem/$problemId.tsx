import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { findProblemPrivacy, findProblemTeam } from "~/utils/db/problem";
import { HiOutlineEyeOff, HiOutlineTag, HiOutlineX } from "react-icons/hi";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";

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
  const loaderData = useSignalLoaderData<typeof loader>();
  const problem = useComputed(() => loaderData.value.problem);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);

  return (
    <>
      <h1>{problem.value.title}</h1>

      {(problem.value.tags.length > 0 || problem.value.private) && (
        <div className="not-prose flex flex-wrap gap-2">
          {problem.value.private && (
            <span className="badge badge-warning gap-1">
              <HiOutlineEyeOff />
              <span>隐藏</span>
            </span>
          )}
          {!problem.value.allowSubmit && (
            <span className="badge badge-error gap-1">
              <HiOutlineX />
              <span>禁止提交</span>
            </span>
          )}
          {problem.value.tags.map(({ name }) => (
            <Link
              className="badge gap-1"
              to={`/problem?tags=${name}`}
              key={name}
            >
              <HiOutlineTag />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      )}

      <p className="not-prose tabs tabs-boxed bg-base-100">
        <NavLink className="tab" to="desc">
          题面
        </NavLink>
        <NavLink className="tab" to="submit">
          提交
        </NavLink>
        {hasEditPerm.value && (
          <NavLink className="tab" to="data">
            数据
          </NavLink>
        )}
        {hasEditPerm.value && (
          <NavLink className="tab" to="edit">
            编辑
          </NavLink>
        )}
        <NavLink className="tab" to="board">
          榜单
        </NavLink>
        <Link className="tab" to={`/record?pid=${problem.value.id}`}>
          提交记录
        </Link>
      </p>

      <Outlet />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

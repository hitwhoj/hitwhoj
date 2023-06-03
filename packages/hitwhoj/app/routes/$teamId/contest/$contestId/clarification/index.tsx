import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Link } from "@remix-run/react";
import { HiOutlineArrowsExpand, HiOutlinePlus } from "react-icons/hi";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const [canSubmit, canReply] = await self
    .newTeam(await findContestTeam(contestId))
    .hasPrivilege(
      PERM_TEAM.PERM_VIEW_CONTEST_PUBLIC,
      PERM_TEAM.PERM_EDIT_CONTEST_PUBLIC
    );

  const problems = await db.contestProblem.findMany({
    where: { contestId },
    select: {
      rank: true,
      problem: {
        select: {
          title: true,
        },
      },
    },
  });

  // prisma中where条件为undefined时会被忽略
  const clarifications = await db.clarification.findMany({
    where: {
      contestId: contestId,
      userId: canReply ? undefined : self.userId ?? undefined,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      user: { select: { ...selectUserData } },
      applicant: { select: { ...selectUserData } },
      rank: true,
      resolved: true,
      createdAt: true,
      replies: {
        select: {
          id: true,
          replier: {
            select: {
              username: true,
            },
          },
          content: true,
          createdAt: true,
        },
      },
    },
  });

  return json({
    canSubmit,
    clarifications,
    problems,
  });
}

export default function ContestClarification() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const canSubmit = useComputed(() => loaderData.value.canSubmit);
  const clarifications = useComputed(() => loaderData.value.clarifications);

  return (
    <>
      <table className="not-prose table w-full">
        <thead>
          <tr>
            <th>用户</th>
            <th>题号</th>
            <th>内容</th>
            <th>状态</th>
            <th>回复</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {clarifications.value.length === 0 ? (
            <tr>
              <td colSpan={5}>暂无</td>
            </tr>
          ) : (
            clarifications.value.map((clarification) => (
              <tr key={clarification.id}>
                <td>
                  <UserLink user={clarification.user} />
                </td>
                <td>{String.fromCharCode(clarification.rank + 0x40)}</td>
                <td>
                  {clarification.content.length > 20
                    ? `${clarification.content.slice(0, 20)}...`
                    : clarification.content}
                </td>
                <td>{clarification.resolved ? "已解决" : "未解决"}</td>
                <td>{clarification.replies.length}</td>
                <td>
                  <Link
                    className="link inline-flex items-center gap-2"
                    to={clarification.id.toString()}
                  >
                    <span>查看详情</span>
                    <HiOutlineArrowsExpand />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {canSubmit.value && (
        <div className="flex justify-end">
          <Link className="btn btn-primary gap-2" to="submit">
            <HiOutlinePlus />
            <span>提交</span>
          </Link>
        </div>
      )}
    </>
  );
}

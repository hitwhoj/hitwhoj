import { json, type LoaderArgs } from "@remix-run/node";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { Permissions } from "~/utils/permission/permission";
import { db } from "~/utils/server/db.server";
import { Link, useLoaderData } from "@remix-run/react";
import { HiOutlineArrowsExpand, HiOutlinePlus } from "react-icons/hi";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const [canSubmit, canReply] = await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .hasPermission(
      Permissions.PERM_SUBMIT_CONTEST_CLARIFICATION,
      Permissions.PERM_REPLY_CONTEST_CLARIFICATION
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
      userId: canReply ? undefined : self.userId!,
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
  const { canSubmit, clarifications } = useLoaderData<typeof loader>();

  return (
    <>
      <table className="table w-full not-prose">
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
          {clarifications.length === 0 ? (
            <tr>
              <td colSpan={5}>暂无</td>
            </tr>
          ) : (
            clarifications.map((clarification) => (
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
                    className="link inline-flex gap-2 items-center"
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
      {canSubmit && (
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

import { json, type LoaderArgs } from "@remix-run/node";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { idScheme } from "~/utils/scheme";
import { Permissions } from "~/utils/permission/permission";
import { db } from "~/utils/server/db.server";
import { Link, useLoaderData } from "@remix-run/react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { useContext } from "react";
import { UserContext } from "~/utils/context/user";

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
    select: {
      id: true,
      content: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      applicant: {
        select: {
          username: true,
          avatar: true,
        },
      },
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
    canReply,
    clarifications,
    problems,
  });
}

export default function ContestClarification() {
  const { canSubmit, canReply, clarifications } =
    useLoaderData<typeof loader>();
  const self = useContext(UserContext);

  return (
    <div className="not-prose overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>用户</th>
            <th>题号</th>
            <th>内容</th>
            <th>状态</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {clarifications.length === 0 ? (
            <tr>
              <td colSpan={2}>暂无</td>
            </tr>
          ) : (
            clarifications
              .filter((clarification) => {
                return !canReply ? clarification.user.id === self : true;
              })
              .sort((a, b) => {
                return a.createdAt < b.createdAt ? 1 : -1;
              })
              .map((clarification) => (
                <tr key={clarification.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`${clarification.user.avatar}`}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {clarification.user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {clarification.createdAt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {String.fromCharCode(clarification.rank + 0x40)}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {clarification.content}
                    </div>
                    <div className="text-sm text-gray-500">
                      {clarification.replies.length !== 0 && (
                        <>
                          <span>回复：</span>
                          {clarification.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="card bg-base-100 shadow"
                            >
                              {canReply && (
                                <div className="text-sm font-medium text-gray-900">
                                  {reply.replier.username}
                                </div>
                              )}
                              <div className="text-sm text-gray-900">
                                {reply.content}
                              </div>
                              <div className="text-sm text-gray-500">
                                {reply.createdAt}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {clarification.resolved ? "已解决" : "未解决"}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      <Link
                        className="link inline-flex gap-2 items-center"
                        to={clarification.id.toString()}
                      >
                        <span>查看详情</span>
                        <HiOutlineArrowsExpand />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      {canSubmit && (
        <div className="flex justify-end">
          <Link className="link inline-flex gap-2 items-center" to={"submit"}>
            <button className="btn btn-primary">提交</button>
          </Link>
        </div>
      )}
    </div>
  );
}

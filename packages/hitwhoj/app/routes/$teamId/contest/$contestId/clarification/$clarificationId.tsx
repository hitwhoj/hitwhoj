import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useParams } from "@remix-run/react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Fullscreen from "~/src/Fullscreen";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Permissions } from "~/utils/permission/permission";
import {
  clarificationAssignSubject,
  clarificationReplySubject,
  clarificationResolveSubject,
} from "~/utils/serverEvents";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";
import { formatDateTime, formatRelativeDateTime } from "~/utils/tools";
import { useSignalLoaderData, useSignalTransition } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const clarificationId = invariant(idScheme, params.clarificationId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  const [canReply] = await self
    .newTeam(await findContestTeam(contestId))
    .hasPrivilege(PERM_TEAM.PERM_EDIT_CONTEST_PUBLIC);

  const clarification = await db.clarification.findUnique({
    where: { id: clarificationId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { ...selectUserData } },
      applicant: { select: { ...selectUserData } },
      resolved: true,
      rank: true,
      contest: {
        select: {
          title: true,
        },
      },
      replies: {
        orderBy: { createdAt: "asc" },
        select: {
          createdAt: true,
          content: true,
          id: true,
          replier: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  if (!clarification) {
    throw new Response("Clarification not found", { status: 404 });
  }

  return json({ clarification, canReply });
}

enum ActionType {
  Reply = "Reply",
  Apply = "Apply",
  Resolve = "Resolve",
}

export default function ClarificationDetail() {
  const { contestId } = useParams();

  const loaderData = useSignalLoaderData<typeof loader>();
  const clarification = useComputed(() => loaderData.value.clarification);
  const canReply = useComputed(() => loaderData.value.canReply);

  const transition = useSignalTransition();

  return (
    <Fullscreen visible={true} className="bg-base-100 overflow-auto">
      <div className="mx-auto w-full max-w-2xl p-4">
        <div>
          <Link
            className="btn btn-ghost gap-2"
            to={`/contest/${contestId}/clarification`}
          >
            <HiOutlineChevronLeft />
            <span>返回</span>
          </Link>
        </div>

        <h2>反馈 #{clarification.value.id}</h2>

        <table>
          <tbody>
            <tr>
              <th>提交者</th>
              <td>
                <UserLink user={clarification.value.user} />
              </td>
            </tr>
            <tr>
              <th>创建时间</th>
              <td>{formatDateTime(clarification.value.createdAt)}</td>
            </tr>
            <tr>
              <th>状态</th>
              <td>{clarification.value.resolved ? "已解决" : "未解决"}</td>
            </tr>
          </tbody>
        </table>

        <blockquote className="break-words">
          {clarification.value.content}
        </blockquote>

        <h3>回复</h3>

        {clarification.value.replies.length === 0 ? (
          <p className="italic opacity-60">暂无回复</p>
        ) : (
          clarification.value.replies.map((reply) => (
            <p key={reply.id} className="flex flex-col break-words">
              <span>{reply.content}</span>
              <span className="text-xs opacity-60">
                {formatRelativeDateTime(reply.createdAt)}
              </span>
            </p>
          ))
        )}

        {canReply.value ? (
          <>
            <h3>裁判操作</h3>
            {clarification.value.resolved ? (
              <p className="alert alert-success">反馈已经解决</p>
            ) : (
              <>
                <div className="flex justify-end gap-4">
                  <Form method="post" className="inline-block">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      name="_action"
                      value={ActionType.Apply}
                      disabled={transition.isRunning}
                    >
                      认领给自己
                    </button>
                  </Form>

                  <Form method="post" className="inline-block">
                    <button
                      className="btn btn-success"
                      type="submit"
                      name="_action"
                      value={ActionType.Resolve}
                      disabled={transition.isRunning}
                    >
                      标记为解决
                    </button>
                  </Form>
                </div>

                <Form method="post" className="form-control gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">回复内容</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      name="content"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      name="_action"
                      value={ActionType.Reply}
                      disabled={transition.isRunning}
                    >
                      提交回复
                    </button>
                  </div>
                </Form>
              </>
            )}
          </>
        ) : (
          !clarification.value.resolved && (
            <div className="alert alert-info">请耐心等待裁判回复</div>
          )
        )}
      </div>
    </Fullscreen>
  );
}

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const clarificationId = invariant(idScheme, params.clarificationId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_REPLY_CONTEST_CLARIFICATION);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.Reply: {
      const content = invariant(contentScheme, form.get("content"));

      const clarification = await db.clarification.findUnique({
        where: { id: clarificationId },
        select: {
          id: true,
          contestId: true,
          userId: true,
          rank: true,
          content: true,
          resolved: true,
          applicantId: true,
        },
      });

      if (!clarification) {
        throw new Response("Clarification not found", { status: 404 });
      }

      if (clarification.resolved) {
        throw new Response("clarification already resolved", { status: 400 });
      }

      // 第一个回答的管理员会自动申领该 Clarification
      if (!clarification.applicantId) {
        await db.clarification.update({
          where: { id: clarificationId },
          data: { applicantId: self.userId },
        });
        clarificationAssignSubject.next(clarificationId);
      }

      const reply = await db.clarificationReply.create({
        data: {
          clarificationId,
          replierId: self.userId!,
          content,
        },
        select: { id: true },
      });
      clarificationReplySubject.next(reply.id);

      return null;
    }

    case ActionType.Apply: {
      const clarification = await db.clarification.findUnique({
        where: { id: clarificationId },
        select: { applicantId: true },
      });

      if (!clarification) {
        throw new Response("Clarification not found", { status: 404 });
      }

      if (clarification.applicantId) {
        throw new Response("clarification already applied", { status: 400 });
      }

      await db.clarification.update({
        where: { id: clarificationId },
        data: { applicantId: self.userId! },
      });
      clarificationAssignSubject.next(clarificationId);

      return null;
    }
    case ActionType.Resolve: {
      const clarification = await db.clarification.findUnique({
        where: { id: clarificationId },
        select: {
          id: true,
          contestId: true,
          userId: true,
          rank: true,
          content: true,
          resolved: true,
        },
      });

      if (!clarification) {
        throw new Response("Clarification not found", { status: 404 });
      }

      if (clarification.resolved) {
        throw new Response("clarification already resolved", { status: 400 });
      }

      await db.clarification.update({
        where: { id: clarificationId },
        data: { resolved: true },
      });
      clarificationResolveSubject.next(clarificationId);

      return null;
    }
  }
}

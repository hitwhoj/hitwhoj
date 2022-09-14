import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Fullscreen from "~/src/Fullscreen";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Permissions } from "~/utils/permission/permission";
import { clarificationSubject } from "~/utils/serverEvents";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const clarificationId = invariant(idScheme, params.clarificationId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  const [canReply] = await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .hasPermission(Permissions.PERM_REPLY_CONTEST_CLARIFICATION);

  const clarification = await db.clarification.findUnique({
    where: { id: clarificationId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
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
      resolved: true,
      rank: true,
      contest: {
        select: {
          title: true,
        },
      },
      replies: {
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
  const { clarification, canReply } = useLoaderData<typeof loader>();
  const { state, type } = useTransition();
  const isSubmitting = state === "submitting" || type === "actionReload";

  return (
    <Fullscreen
      visible={true}
      className="flex flex-col items-center justify-center bg-slate-100"
    >
      <div className="flex flex-col items-center justify-center">
        <Link
          className="btn btn-primary"
          to={`/contest/${contestId}/clarification`}
        >
          <HiOutlineChevronLeft />
          <span>返回</span>
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="card w-full shadow">
          <img
            src={clarification.user.avatar}
            alt="avatar"
            className="w-4 h-4 rounded-full"
          />
          <span>{clarification.user.username}</span>
          <span>{clarification.content}</span>
          <span>{clarification.createdAt}</span>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          {clarification.replies.length === 0 ? (
            <div className="card w-full shadow">
              <span>暂无回复</span>
            </div>
          ) : (
            clarification.replies.map((reply) => (
              <div key={reply.id} className="card w-full shadow">
                {canReply && (
                  <>
                    <img
                      src={reply.replier.avatar}
                      alt={reply.replier.username}
                      className="w-4 h-4 rounded-full"
                    />
                    <span>{reply.replier.username}</span>
                  </>
                )}
                <span>{reply.content}</span>
                <span>{reply.createdAt}</span>
              </div>
            ))
          )}
        </div>
        {canReply && (
          <div className="flex flex-col items-center justify-center w-full">
            <div>
              <Form method="post">
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="_action"
                  value={ActionType.Apply}
                  disabled={isSubmitting}
                >
                  认领
                </button>
              </Form>
              <Form method="post">
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="_action"
                  value={ActionType.Resolve}
                  disabled={isSubmitting}
                >
                  解决
                </button>
              </Form>
            </div>
            <Form method="post" className="form-control gap-4">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">回复内容</span>
                </label>
                <textarea
                  className="textarea h-24 textarea-bordered"
                  name="content"
                  required
                />
              </div>
              <div className="form-control w-full max-w-xs">
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="_action"
                  value={ActionType.Reply}
                  disabled={isSubmitting}
                >
                  提交
                </button>
              </div>
            </Form>
          </div>
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

      // 第一个回答的管理员会自动申领该Clarification
      if (!clarification.applicantId) {
        await db.clarification.update({
          where: { id: clarificationId },
          data: { applicantId: self.userId },
        });
      }

      const reply = await db.clarificationReply.create({
        data: {
          clarificationId,
          replierId: self.userId!,
          content,
        },
      });

      clarificationSubject.next({ ...clarification, type: "reply" });

      return json({ id: reply.id });
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
        where: {
          id: clarificationId,
        },
        data: {
          applicantId: self.userId!,
        },
      });

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
        where: {
          id: clarificationId,
        },
        data: {
          resolved: true,
        },
      });

      clarificationSubject.next({ ...clarification, type: "resolve" });

      return null;
    }
  }
}

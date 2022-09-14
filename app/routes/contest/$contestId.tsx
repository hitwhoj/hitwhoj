import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useParams,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import {
  findContestPrivacy,
  findContestStatus,
  findContestTeam,
} from "~/utils/db/contest";
import { ContestStateTag } from "~/src/contest/ContestStateTag";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { ContestPermission } from "~/utils/permission/permission/contest";
import { AiOutlineTrophy } from "react-icons/ai";
import { HiOutlineEyeOff, HiOutlineTag } from "react-icons/hi";
import { useContext, useEffect } from "react";
import { ToastContext } from "~/utils/context/toast";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "./$contestId/clarificationEvents";
import { UserContext } from "~/utils/context/user";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const perm = self.team(await findContestTeam(contestId)).contest(contestId);
  await perm.checkPermission(
    (await findContestPrivacy(contestId))
      ? Permissions.PERM_VIEW_CONTEST
      : Permissions.PERM_VIEW_CONTEST_PUBLIC
  );
  const status = await findContestStatus(contestId);
  const [hasEditPerm, hasViewProblemPerm, isContestants] =
    await perm.hasPermission(
      Permissions.PERM_EDIT_CONTEST,
      status === "Pending"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_BEFORE
        : status === "Running"
        ? Permissions.PERM_VIEW_CONTEST_PROBLEMS_DURING
        : Permissions.PERM_VIEW_CONTEST_PROBLEMS_AFTER,
      ContestPermission.Contestants
    );
  const [canSubmit, canReply] = await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .hasPermission(
      Permissions.PERM_SUBMIT_CONTEST_CLARIFICATION,
      Permissions.PERM_REPLY_CONTEST_CLARIFICATION
    );

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      system: true,
      beginTime: true,
      endTime: true,
      private: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({
    contest,
    hasEditPerm,
    hasViewProblemPerm,
    isContestants,
    canSubmit,
    canReply,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
});

export default function ContestView() {
  const {
    contest,
    hasEditPerm,
    hasViewProblemPerm,
    isContestants,
    canSubmit,
    canReply,
  } = useLoaderData<typeof loader>();
  const { contestId } = useParams();
  const self = useContext(UserContext);

  const Toasts = useContext(ToastContext);

  const location = useLocation();

  useEffect(() => {
    const subsctiption = fromEventSource<MessageType>(
      `/contest/${contestId}/clarificationEvents`
    ).subscribe((message) => {
      if (canSubmit && message.userId === self) {
        switch (message.type) {
          case "reply":
            Toasts.info(
              `您对问题${String.fromCharCode(
                message.rank + 0x40
              )}的反馈有新的回复`
            );
            if (location.pathname === `/contest/${contestId}/clarification`) {
              document.getElementById("clarification")?.click();
            }

            break;
          case "resolve":
            Toasts.info(
              `您对问题${String.fromCharCode(
                message.rank + 0x40
              )}的反馈已被标记为解决`
            );
            if (location.pathname === `/contest/${contestId}/clarification`) {
              document.getElementById("clarification")?.click();
            }

            break;
        }
      }
      if (canReply && message.type === "submit") {
        Toasts.info(
          `用户对问题${String.fromCharCode(
            message.rank + 0x40
          )}有新的反馈，请及时处理`
        );
        if (location.pathname === `/contest/${contestId}/clarification`) {
          document.getElementById("clarification")?.click();
        }
      }
    });
    return () => subsctiption.unsubscribe();
  }, []);

  return (
    <>
      <h1 className="flex gap-4">
        <AiOutlineTrophy className="flex-shrink-0" />
        <span>{contest.title}</span>
      </h1>

      <p className="flex flex-wrap gap-2 not-prose">
        <ContestStateTag
          beginTime={contest.beginTime}
          endTime={contest.endTime}
        />
        <ContestSystemTag system={contest.system} />
        {contest.private && (
          <span className="badge badge-warning gap-1">
            <HiOutlineEyeOff />
            <span>隐藏</span>
          </span>
        )}
        {contest.tags.map(({ name }) => (
          <Link className="badge gap-1" to={`/contest/tag/${name}`} key={name}>
            <HiOutlineTag />
            <span>{name}</span>
          </Link>
        ))}
      </p>

      <p className="tabs tabs-boxed bg-base-100 not-prose">
        <NavLink className="tab" to="desc">
          详情
        </NavLink>
        {(hasViewProblemPerm || isContestants) && (
          <NavLink className="tab" to="problem">
            题目
          </NavLink>
        )}
        {hasEditPerm && (
          <NavLink className="tab" to="edit">
            编辑
          </NavLink>
        )}
        <NavLink id="clarification" className="tab" to="clarification">
          反馈
        </NavLink>
      </p>

      <Outlet />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { idScheme, contestParticipantRoleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestParticipantRole } from "@prisma/client";
import { UserAvatar } from "~/src/user/UserAvatar";
import { useContext, useEffect } from "react";
import { ToastContext } from "~/utils/context/toast";
import { HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_EDIT_CONTEST);

  const members = await db.contestParticipant.findMany({
    where: {
      contestId,
    },
    select: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          nickname: true,
        },
      },
      role: true,
    },
  });

  return json({ members });
}

enum ActionType {
  DeleteMember = "DeleteMember",
  ChangeRole = "ChangeRole",
}

export async function action({ params, request }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_EDIT_CONTEST);

  const form = await request.formData();
  const _action = form.get("_action");
  const userId = invariant(idScheme, form.get("member"));

  switch (_action) {
    case ActionType.DeleteMember: {
      await db.contestParticipant.delete({
        where: {
          contestId_userId: {
            contestId,
            userId,
          },
        },
      });
      return null;
    }

    case ActionType.ChangeRole: {
      const role = invariant(contestParticipantRoleScheme, form.get("role"));
      await db.contestParticipant.update({
        where: {
          contestId_userId: {
            contestId,
            userId,
          },
        },
        data: {
          role,
        },
      });
      return null;
    }
  }
}

function DeleteMember({ id }: { id: number }) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("踢出成功");
    }
  }, [isActionReload]);

  return (
    <fetcher.Form
      method="post"
      className="tooltip tooltip-error"
      data-tip="踢出团队"
    >
      <input type="hidden" name="member" value={id} />
      <button
        type="submit"
        name="_action"
        value={ActionType.DeleteMember}
        disabled={isLoading}
      >
        <HiOutlineLogout className="w-6 h-6" />
      </button>
    </fetcher.Form>
  );
}

function SetMemberRole({
  id,
  role,
}: {
  id: number;
  role: ContestParticipantRole;
}) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("设定成员角色成功");
    }
  }, [isActionReload]);

  const isJury = role === ContestParticipantRole.Jury;
  const isMember = role === ContestParticipantRole.Contestant;

  return (
    <fetcher.Form method="post" className="dropdown dropdown-hover">
      <input type="hidden" name="member" value={id} />
      <input type="hidden" name="_action" value={ActionType.ChangeRole} />
      <label tabIndex={0} className="hover:cursor-pointer">
        <HiOutlineCog className="w-6 h-6" />
      </label>
      <ul className="dropdown-content shadow-2xl menu p-2 bg-base-300 w-72 rounded-box">
        <li className={isJury ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={ContestParticipantRole.Jury}
            disabled={isJury || isLoading}
          >
            设置为裁判
          </button>
        </li>
        <li className={isMember ? "disabled" : ""}>
          <button
            type="submit"
            name="role"
            value={ContestParticipantRole.Contestant}
            disabled={isMember || isLoading}
          >
            设置为普通成员
          </button>
        </li>
      </ul>
    </fetcher.Form>
  );
}

export default function ContestMembers() {
  const { members } = useLoaderData<typeof loader>();

  return (
    <table className="table w-full not-prose">
      <thead>
        <tr>
          <th>成员</th>
          <th>角色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {members.map(
          ({ user: { id: userId, username, nickname, avatar }, role }) => {
            return (
              <tr key={userId}>
                <td>
                  <Link
                    className="link inline-flex gap-2 items-center space-x-1"
                    to={`/user/${userId}`}
                  >
                    <UserAvatar
                      user={{ username, avatar, nickname }}
                      className="w-8 h-8 text-2xl"
                    />
                    <span>{nickname}</span>
                  </Link>
                </td>
                <td>{role}</td>
                {role != ContestParticipantRole.Mod && (
                  <td className="space-x-3">
                    <SetMemberRole id={userId} role={role} />
                    <DeleteMember id={userId} />
                  </td>
                )}
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

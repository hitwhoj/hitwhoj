import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { findContestTeam } from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { idScheme, contestParticipantRoleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { ContestParticipantRole } from "@prisma/client";
import { useContext, useEffect, useMemo } from "react";
import { ToastContext } from "~/utils/context/toast";
import { HiOutlineCog, HiOutlineLogout } from "react-icons/hi";
import { UserLink } from "~/src/user/UserLink";
import { selectUserData } from "~/utils/db/user";

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
      user: { select: selectUserData },
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
        className="btn btn-square btn-error btn-sm"
      >
        <HiOutlineLogout />
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
      <span className="btn btn-square btn-sm">
        <HiOutlineCog />
      </span>
      <ul className="dropdown-content menu rounded-box w-72 bg-base-300 p-2 shadow-2xl">
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

  const sortMembers = useMemo(() => {
    const mods = members.filter(
      ({ role }) => role === ContestParticipantRole.Mod
    );
    const juries = members.filter(
      ({ role }) => role === ContestParticipantRole.Jury
    );
    const contestants = members.filter(
      ({ role }) => role === ContestParticipantRole.Contestant
    );
    return [...mods, ...juries, ...contestants];
  }, [members]);

  return (
    <table className="not-prose table-compact table w-full">
      <thead>
        <tr>
          <th>成员</th>
          <th>角色</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {sortMembers.map(({ user, role }) => {
          return (
            <tr key={user.id}>
              <td>
                <UserLink user={user} />
              </td>
              <td>
                {role === ContestParticipantRole.Mod ? (
                  <span className="badge badge-primary">管理员</span>
                ) : role === ContestParticipantRole.Jury ? (
                  <span className="badge badge-secondary">裁判</span>
                ) : (
                  <span className="badge">参赛选手</span>
                )}
              </td>
              {role != ContestParticipantRole.Mod ? (
                <td className="space-x-3">
                  <SetMemberRole id={user.id} role={role} />
                  <DeleteMember id={user.id} />
                </td>
              ) : (
                <td>-</td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

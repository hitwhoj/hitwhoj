import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { TeamMemberRole } from "~/utils/domain/role";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { teamNameScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Form } from "@remix-run/react";
import { Privileges } from "~/utils/new-permission/privilege";
import { useSignalTransition } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPrivilege(Privileges.PRIV_TEAM_CREATE);

  return null;
}

export const meta: MetaFunction = () => ({
  title: "新建团队 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPrivilege(Privileges.PRIV_TEAM_CREATE);

  const form = await request.formData();
  const name = invariant(teamNameScheme, form.get("name"));
  const team = await db.team.findUnique({
    where: {
      name: name,
    },
  });
  if (team) {
    throw new Response("团队已存在", { status: 403 });
  }
  const { id: teamId } = await db.team.create({
    data: {
      id: name,
      name,
      teamRole: {
        create: [
          {
            role: TeamMemberRole.Owner,
            description: "",
            privilege: PERM_TEAM.PERM_OWNER,
          },
          {
            role: TeamMemberRole.Admin,
            description: "",
            privilege: PERM_TEAM.PERM_ADMIN,
          },
          {
            role: TeamMemberRole.Member,
            description: "",
            privilege: PERM_TEAM.PERM_MEMBER,
          },
        ],
      },
      members: {
        create: [
          {
            userId: self.userId!,
            roleName: TeamMemberRole.Owner,
          },
        ],
      },
    },
  });

  return redirect(`/${teamId}/control/settings`);
}

export default function NewTeam() {
  const transition = useSignalTransition();

  const Toasts = useToasts();

  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("创建成功");
    }
  }, [transition.actionSuccess]);

  return (
    <>
      <h1>创建团队</h1>

      <p>创建一个新的团队！</p>

      <Form method="post" className="form-control w-full max-w-xs gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">团队名称</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            name="name"
            required
            disabled={transition.actionSuccess}
          />
        </div>

        <div className="form-control">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={transition.actionSuccess}
          >
            创建团队
          </button>
        </div>
      </Form>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

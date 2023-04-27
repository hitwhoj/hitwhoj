import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { teamNameScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";
import { findRequestUser } from "~/utils/permission";
import { Form } from "@remix-run/react";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { useSignalTransition } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(Permissions.PERM_TEAM_CREATE);

  return null;
}

export const meta: MetaFunction = () => ({
  title: "新建团队 - HITwh OJ",
});

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(Permissions.PERM_TEAM_CREATE);

  const form = await request.formData();
  const name = invariant(teamNameScheme, form.get("name"));

  const { id: teamId } = await db.team.create({
    data: {
      name: name,
      members: {
        create: [
          {
            userId: self.userId!,
            role: TeamMemberRole.Owner,
          },
        ],
      },
    },
  });

  return redirect(`/team/${teamId}/settings`);
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

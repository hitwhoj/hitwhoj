import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { teamNameScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";
import { Message } from "@arco-design/web-react";
import { findRequestUser } from "~/utils/permission";
import { Form, useTransition } from "@remix-run/react";
import { useEffect } from "react";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";

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
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionRedirect = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionRedirect;

  useEffect(() => {
    if (isActionRedirect) {
      Message.success("创建成功");
    }
  }, [isActionRedirect]);

  return (
    <>
      <h1>创建团队</h1>
      <p>创建一个新的团队！</p>
      <Form method="post" className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">团队名称</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="name"
          required
          disabled={isLoading}
        />
        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={isLoading}
        >
          创建团队
        </button>
      </Form>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

import {
  type MetaFunction,
  type LoaderArgs,
  redirect,
  type ActionArgs,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useSignalTransition } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { idScheme, titleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(teamId).checkPermission(Permissions.PERM_CREATE_PROBLEM_SET);
  return null;
}

export async function action({ request, params }: ActionArgs) {
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(teamId).checkPermission(Permissions.PERM_CREATE_PROBLEM_SET);

  const form = await request.formData();
  const title = invariant(titleScheme, form.get("title"));
  const { id: problemSetId } = await db.problemSet.create({
    data: {
      title: title,
      teamId: teamId,
    },
  });

  return redirect(`/team/${teamId}/problemset/${problemSetId}/edit`);
}

export const meta: MetaFunction = () => ({
  title: "创建题单 - HITwh OJ",
});

export default function ProblemSetNew() {
  const transition = useSignalTransition();

  return (
    <>
      <h2>创建团队题单</h2>

      <Form method="post" className="form-control w-full max-w-xs gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">标题</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            name="title"
            disabled={transition.isRunning}
            required
          />
        </div>

        <div className="form-control">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={transition.isRunning}
          >
            创建题单
          </button>
        </div>
      </Form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

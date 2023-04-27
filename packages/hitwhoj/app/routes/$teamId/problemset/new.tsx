import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { titleScheme } from "~/utils/scheme";
import { Privileges } from "~/utils/permission/privilege";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { useSignalTransition } from "~/utils/hooks";
import {teamIdScheme} from "~/utils/new-permission/scheme";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_PROBLEM_SET);

  return null;
}

export async function action({ request,params}: ActionArgs) {
  const self = await findRequestUser(request);
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_PROBLEM_SET);

  const form = await request.formData();
  const title = invariant(titleScheme, form.get("title"));

  const { id: problemSetId } = await db.problemSet.create({
    data: {teamId, title },
  });

  return redirect(`/${teamId}/problemset/${problemSetId}/edit`);
}

export const meta: MetaFunction = () => ({
  title: "创建题单 - HITwh OJ",
});

export default function ProblemSetNew() {
  const transition = useSignalTransition();

  return (
    <>
      <h1>创建题单</h1>

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

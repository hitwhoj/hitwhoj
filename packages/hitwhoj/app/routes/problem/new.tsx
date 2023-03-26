import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useSignalTransition } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { titleScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_PROBLEM);

  return null;
}

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_PROBLEM);

  const form = await request.formData();

  const title = invariant(titleScheme, form.get("title"));

  const { id } = await db.problem.create({
    data: { title },
  });

  return redirect(`/problem/${id}/edit`);
}

export default function ProblemNew() {
  const transition = useSignalTransition();

  return (
    <>
      <h1>新建题目</h1>

      <Form method="post" className="form-control w-full max-w-xs gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">题目名称</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            name="title"
            required
            disabled={transition.isRunning}
          />
        </div>

        <div className="form-control">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={transition.isRunning}
          >
            创建题目
          </button>
        </div>
      </Form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

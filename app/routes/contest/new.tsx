import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  datetimeStringScheme,
  descriptionScheme,
  systemScheme,
  timezoneScheme,
  titleScheme,
} from "~/utils/scheme";
import { ContestSystem } from "@prisma/client";
import { adjustTimezone } from "~/utils/time";
import { useEffect } from "react";
import { Message } from "@arco-design/web-react";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_CONTEST);

  return null;
}

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(null).checkPermission(Permissions.PERM_CREATE_CONTEST);

  const form = await request.formData();

  const title = invariant(titleScheme, form.get("title"));
  const description = invariant(descriptionScheme, form.get("description"));

  // 客户端时区
  const timezone = invariant(timezoneScheme, form.get("timezone"));
  const beginTime = adjustTimezone(
    invariant(datetimeStringScheme, form.get("beginTime")),
    timezone
  );
  const endTime = adjustTimezone(
    invariant(datetimeStringScheme, form.get("endTime")),
    timezone
  );
  const system = invariant(systemScheme, form.get("system"));

  const { id: contestId } = await db.contest.create({
    data: {
      title,
      description,
      beginTime,
      endTime,
      system,
      participants: {
        create: {
          userId: self.userId!,
          role: "Mod",
        },
      },
    },
  });

  return redirect(`/contest/${contestId}/edit`);
}

export const meta: MetaFunction = () => ({
  title: "创建比赛 - HITwh OJ",
});

export default function ContestNew() {
  const { state, type } = useTransition();

  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionRedirect = state === "loading" && type === "actionRedirect";
  const isLoading = isActionSubmit || isActionRedirect;

  useEffect(() => {
    if (isActionRedirect) {
      Message.success("创建成功");
    }
  }, [isActionRedirect]);

  return (
    <>
      <h1>创建比赛</h1>
      <Form method="post" className="form-control">
        <label className="label">
          <span className="label-text">标题</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="text"
          name="title"
          required
          disabled={isLoading}
        />

        <label className="label">
          <span className="label-text">比赛介绍</span>
        </label>
        <textarea
          name="description"
          className="textarea textarea-bordered"
          required
          disabled={isLoading}
        />

        <label className="label">
          <span className="label-text">比赛开始时间</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="datetime-local"
          name="beginTime"
          required
          disabled={isLoading}
        />

        <label className="label">
          <span className="label-text">比赛结束时间</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="datetime-local"
          name="endTime"
          required
          disabled={isLoading}
        />
        <input
          type="hidden"
          name="timezone"
          value={new Date().getTimezoneOffset()}
        />

        <label className="label">
          <span className="label-text">比赛赛制</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          name="system"
          required
          disabled={isLoading}
        >
          <option value="" disabled selected>
            请选择比赛的赛制
          </option>
          {Object.keys(ContestSystem).map((key) => (
            <option key={key} value={key}>
              {ContestSystem[key as keyof typeof ContestSystem]}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary w-full max-w-xs mt-4"
          type="submit"
          disabled={isLoading}
        >
          创建比赛
        </button>
      </Form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

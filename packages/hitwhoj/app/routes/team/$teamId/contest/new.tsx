import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  datetimeStringScheme,
  descriptionScheme,
  systemScheme,
  timezoneScheme,
  titleScheme,
} from "~/utils/scheme";
import { ContestParticipantRole, ContestSystem } from "@prisma/client";
import { adjustTimezone } from "~/utils/time";
import { idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { MarkdownEditor } from "~/src/MarkdownEditor";
import { useSignalEffect } from "@preact/signals-react";
import { useSignalTransition } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";

export async function loader({ request, params }: LoaderArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(teamId).checkPermission(Permissions.PERM_CREATE_CONTEST);

  return null;
}

export async function action({ request, params }: ActionArgs) {
  const teamId = invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(teamId).checkPermission(Permissions.PERM_CREATE_CONTEST);

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
  const system = invariant(systemScheme, ContestSystem.Homework);

  const { id: contestId } = await db.contest.create({
    data: {
      title,
      description,
      beginTime,
      endTime,
      system,
      teamId,
      participants: {
        create: [{ userId: self.userId!, role: ContestParticipantRole.Mod }],
      },
    },
  });

  return redirect(`/contest/${contestId}`);
}

export const meta: MetaFunction = () => ({
  title: "创建团队比赛 - HITwh OJ",
});

export default function TeamContestNew() {
  const { success, loading } = useSignalTransition();

  const Toasts = useToasts();

  useSignalEffect(() => {
    if (success.value) {
      Toasts.success("创建成功");
    }
  });

  return (
    <>
      <h2>创建团队比赛</h2>

      <Form method="post" className="form-control gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">标题</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            name="title"
            required
            disabled={loading.value}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">比赛介绍</span>
          </label>
          <MarkdownEditor name="description" />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">比赛开始时间</span>
            <span className="label-text-alt">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            name="beginTime"
            required
            disabled={loading.value}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">比赛结束时间</span>
            <span className="label-text-alt">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            name="endTime"
            required
            disabled={loading.value}
          />
          <input
            type="hidden"
            name="timezone"
            value={new Date().getTimezoneOffset()}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">比赛赛制</span>
          </label>
          <select
            className="select select-bordered"
            name="system"
            required
            disabled={loading.value}
            defaultValue=""
          >
            <option value="" disabled>
              请选择比赛的赛制
            </option>
            {Object.keys(ContestSystem).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading.value}
          >
            创建比赛
          </button>
        </div>
      </Form>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

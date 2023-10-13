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
import { ContestSystem } from "@prisma/client";
import { adjustTimezone } from "~/utils/time";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { MarkdownEditor } from "~/src/MarkdownEditor";
import { useSignalTransition } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";
import { type Signal, useSignal, useComputed } from "@preact/signals-react";

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
  const transition = useSignalTransition();

  const Toasts = useToasts();

  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("创建成功");
    }
  }, [transition.actionSuccess]);

  let now = new Date();

  let year: number;
  let month: string;
  let day: string;
  let hours: string;
  let minutes: Signal<string>;

  setInterval(() => {
    now = new Date();
  }, 60000);

  year = now.getFullYear();
  month = String(now.getMonth() + 1).padStart(2, "0");
  day = String(now.getDate()).padStart(2, "0");
  hours = String(now.getHours()).padStart(2, "0");
  minutes = useSignal(String(now.getMinutes()).padStart(2, "0"));

  const formattedDateTime = useComputed(() => {
    return `${year}-${month}-${day}T${hours}:${minutes.value}`;
  });

  return (
    <>
      <h1>创建比赛</h1>

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
            disabled={transition.isRunning}
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
            value={formattedDateTime.value}
            required
            disabled={transition.isRunning}
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
            value={formattedDateTime.value}
            required
            disabled={transition.isRunning}
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
            disabled={transition.isRunning}
          >
            <option value="" disabled selected>
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
            disabled={transition.isRunning}
          >
            创建比赛
          </button>
        </div>
      </Form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

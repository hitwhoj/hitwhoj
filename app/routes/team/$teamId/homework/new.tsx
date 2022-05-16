import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import {
  datetimeStringScheme,
  descriptionScheme,
  systemScheme,
  timezoneScheme,
  titleScheme,
} from "~/utils/scheme";
import { ContestSystem } from "@prisma/client";
import { adjustTimezone, getDatetimeLocal } from "~/utils/time";
import { findSessionUid } from "~/utils/sessions";
import React from "react";
import { idScheme } from "~/utils/scheme";

export const loader: LoaderFunction = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  return null;
};

export const action: ActionFunction<Response> = async ({ params, request }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();

  const title = invariant(titleScheme.safeParse(form.get("title")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  // 客户端时区
  const timezone = invariant(timezoneScheme.safeParse(form.get("timezone")));
  const beginTime = adjustTimezone(
    invariant(datetimeStringScheme.safeParse(form.get("beginTime"))),
    timezone
  );
  const endTime = adjustTimezone(
    invariant(datetimeStringScheme.safeParse(form.get("endTime"))),
    timezone
  );
  const system = invariant(systemScheme.safeParse(ContestSystem.Homework));

  const { id: contestId } = await db.contest.create({
    data: {
      title,
      description,
      beginTime,
      endTime,
      system,
      team: { connect: { id: teamId } },
      creator: { connect: { id: self } },
    },
  });

  return redirect(`/contest/${contestId}`);
};

export const meta: MetaFunction = () => ({
  title: "Create: Contest - HITwh OJ",
});

export default function ContestNew() {
  return (
    <>
      <h1>创建比赛</h1>
      <Form method="post">
        <label htmlFor="title">标题</label>
        <input type="text" name="title" id="title" required />
        <br />
        <label htmlFor="description">描述</label>
        <input type="text" name="description" id="description" required />
        <br />
        <label htmlFor="beginTime">开始时间</label>
        <input
          type="datetime-local"
          name="beginTime"
          id="beginTime"
          defaultValue={getDatetimeLocal(Date.now())}
          required
        />
        <br />
        <label htmlFor="endTime">结束时间</label>
        <input
          type="datetime-local"
          name="endTime"
          id="endTime"
          defaultValue={getDatetimeLocal(Date.now() + 5 * 60 * 60 * 1000)}
          required
        />
        <input
          type="hidden"
          name="timezone"
          value={new Date().getTimezoneOffset()}
        />
        <br />
        <label htmlFor="system">system: </label>
        {Object.values(ContestSystem).map((system) => (
          <React.Fragment key={system}>
            <input
              type="radio"
              name="system"
              id={system}
              value={system}
              defaultChecked={system === ContestSystem.Homework}
              disabled
              required
            />
            <label htmlFor={system}>{system}</label>
          </React.Fragment>
        ))}
        <br />
        <button type="submit">创建</button>
      </Form>
    </>
  );
}

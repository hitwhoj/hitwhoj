import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
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
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
} from "@arco-design/web-react";
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export const loader: LoaderFunction = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  return null;
};

export const action: ActionFunction<Response> = async ({ request }) => {
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
  const system = invariant(systemScheme.safeParse(form.get("system")));

  const { id: contestId } = await db.contest.create({
    data: {
      title,
      description,
      beginTime,
      endTime,
      system,
      creator: { connect: { id: self } },
    },
  });

  return redirect(`/contest/${contestId}`);
};

export const meta: MetaFunction = () => ({
  title: "创建比赛 - HITwh OJ",
});

export default function ContestNew() {
  const [beginTime, setBeginTime] = React.useState(Date.now());
  const [endTime, setEndTime] = React.useState(Date.now() + 5 * 60 * 60 * 1000);
  const [system, setSystem] = React.useState<ContestSystem>(ContestSystem.ACM);
  const fetcher = useFetcher();
  const isCreating = fetcher.state === "submitting";

  return (
    <>
      <h1>创建比赛</h1>
      <fetcher.Form method="post" style={{ maxWidth: 600 }}>
        <FormItem label="标题" required labelCol={{ span: 3 }}>
          <Input name="title" id="title" required />
        </FormItem>
        <FormItem label="描述" required labelCol={{ span: 3 }}>
          <TextArea
            name="description"
            id="description"
            required
            autoSize={{
              minRows: 3,
              maxRows: 10,
            }}
          />
        </FormItem>
        <FormItem label="时间" required labelCol={{ span: 3 }}>
          <input
            type="hidden"
            name="beginTime"
            value={getDatetimeLocal(beginTime)}
            required
          />
          <input
            type="hidden"
            name="endTime"
            value={getDatetimeLocal(endTime)}
            required
          />
          <input
            type="hidden"
            name="timezone"
            value={new Date().getTimezoneOffset()}
          />
          <RangePicker
            defaultValue={[beginTime, endTime]}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            allowClear={false}
            onChange={(dates) => {
              setBeginTime(new Date(dates[0]).valueOf());
              setEndTime(new Date(dates[1]).valueOf());
            }}
          />
        </FormItem>
        <FormItem label="赛制" required labelCol={{ span: 3 }}>
          <input type="hidden" name="system" value={system} required />
          <Select
            value={system}
            onChange={(value) => {
              setSystem(value as ContestSystem);
            }}
            style={{ width: 150 }}
          >
            {Object.values(ContestSystem).map((system) => (
              <Option key={system} value={system} />
            ))}
          </Select>
        </FormItem>
        <FormItem label=" " labelCol={{ span: 3 }}>
          <Button type="primary" htmlType="submit" loading={isCreating}>
            {" "}
            创建比赛{" "}
          </Button>
        </FormItem>
      </fetcher.Form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

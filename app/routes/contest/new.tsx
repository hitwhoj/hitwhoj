import { ActionFunction, Form, MetaFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import {datetimeStringScheme, descriptionScheme, systemScheme, titleScheme} from "~/utils/scheme";
import {ContestSystem} from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const title = invariant(titleScheme.safeParse(form.get("title")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  //TODO: 适应用户时区, 当前默认用户与服务器时区相同
  const beginTime = new Date(invariant(datetimeStringScheme.safeParse(form.get("beginTime"))));
  const endTime = new Date(invariant(datetimeStringScheme.safeParse(form.get("endTime"))));
  const system = invariant(systemScheme.safeParse(form.get("system")));

  const { cid } = await db.contest.create({
    data: {
      title,
      description,
      beginTime,
      endTime,
      system,
    },
  });

  return redirect(`/contest/${cid}`);
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
        <input type="datetime-local" name="beginTime" id="beginTime" required />
        <br />
        <label htmlFor="endTime">结束时间</label>
        <input type="datetime-local" name="endTime" id="endTime" required />
        <br />
        <label htmlFor="system">system</label>
        <input type="radio" name="system" id={ContestSystem.ACM} value={ContestSystem.ACM} required />{ContestSystem.ACM}
        <input type="radio" name="system" id="ACM2" value={ContestSystem.ACM} required />ACM2
        <br />
        <button type="submit">创建</button>
      </Form>
    </>
  );
}

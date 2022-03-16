import { ActionFunction, Form, MetaFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import {datetimeStringScheme, descriptionScheme, systemScheme, timeZoneScheme, titleScheme} from "~/utils/scheme";
import {ContestSystem} from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const title = invariant(titleScheme.safeParse(form.get("title")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );
  const begin = new Date(invariant(datetimeStringScheme.safeParse(form.get("beginTime"))));
  const end = new Date(invariant(datetimeStringScheme.safeParse(form.get("endTime"))));
  // 客户端时区 + 服务器时区, 将时间转换为 UTC 标准时间, 以13位时间戳格式
  const timeZone = invariant(timeZoneScheme.safeParse(Number(form.get("timeZone"))))*60*1000 - new Date(Date.now()).getTimezoneOffset()*60*1000;
  const system = invariant(systemScheme.safeParse(form.get("system")));

  const beginTime = new Date(begin.getTime() + timeZone);
  const endTime = new Date(end.getTime() + timeZone);

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
        <input type="datetime-local" name="beginTime"  id="beginTime"
               defaultValue={(new Date(Date.now() - (new Date(Date.now())).getTimezoneOffset()*60*1000)).toISOString().toString().slice(0, 16)}
               required />
        <br />
        <label htmlFor="endTime">结束时间</label>
        <input type="datetime-local" name="endTime" id="endTime"
               defaultValue={(new Date(Date.now() - (new Date(Date.now())).getTimezoneOffset()*60*1000)).toISOString().toString().slice(0, 16)}
               required />
        <select hidden={true} name="timeZone" id="timeZone" required>
          <option value={(new Date(Date.now())).getTimezoneOffset()} selected >当前浏览器时区</option>
          <option value="8">中国标准时间(+0800)</option>
          <option value="0">格林威治标准时间(-0000)</option>
        </select>
        <br />
        <label htmlFor="system">system: </label>
        {Object.values(ContestSystem).map(system => (
          <>
            <input type="radio" name="system" id={system} value={system} defaultChecked={system === ContestSystem.ACM} required />
            <label htmlFor={system}>{system}</label>
          </>
        ))}
        <br />
        <button type="submit">创建</button>
      </Form>
    </>
  );
}

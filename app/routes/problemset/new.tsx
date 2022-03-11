import { ActionFunction, Form, MetaFunction, redirect } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { descriptionScheme, titleScheme } from "~/utils/scheme";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const title = invariant(titleScheme.safeParse(form.get("title")));
  const description = invariant(
    descriptionScheme.safeParse(form.get("description"))
  );

  const { sid } = await db.problemSet.create({
    data: {
      title,
      description,
    },
  });

  return redirect(`/problemset/${sid}`);
};

export const meta: MetaFunction = () => ({
  title: "Create: Problem Set - HITwh OJ",
});

export default function ProblemSetNew() {
  return (
    <>
      <h1>创建题单</h1>
      <Form method="post">
        <label htmlFor="title">标题</label>
        <input type="text" name="title" id="title" />
        <br />
        <label htmlFor="description">描述</label>
        <input type="text" name="description" id="description" />
        <br />
        <button type="submit">创建</button>
      </Form>
    </>
  );
}

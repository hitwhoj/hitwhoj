import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { findSessionUid } from "~/utils/sessions";
import { invariant } from "~/utils/invariant";
import { commentScheme, tagScheme } from "~/utils/scheme";
import { db } from "~/utils/db.server";

export const action: ActionFunction<Response> = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();
  const title = invariant(commentScheme.safeParse(form.get("title")));
  const tag = invariant(tagScheme.safeParse(form.get("tag")));

  const { id } = await db.comment.create({
    data: {
      title,
      creator: { connect: { id: self } },
      tags: {
        connectOrCreate: {
          where: { name: tag },
          create: { name: tag },
        },
      },
    },
  });

  return redirect(`/comment/${id}`);
};

export const meta: MetaFunction = () => ({
  title: "创建讨论 - HITwh OJ",
});

export default function CommentNew() {
  return (
    <div>
      <h1>New Comment</h1>
      <Form method="post">
        <label>Title</label>
        <input name="title" />
        <br />
        <label>Tag</label>
        <input name="tag" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

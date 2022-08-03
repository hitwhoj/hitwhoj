import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { commentScheme, tagScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export const action: ActionFunction<Response> = async ({ request }) => {
  const self = await findRequestUser(request);

  if (!self.userId) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();
  const title = invariant(commentScheme, form.get("title"));
  const tag = invariant(tagScheme, form.get("tag"));
  const content = invariant(commentScheme, form.get("content"));

  const { id } = await db.comment.create({
    data: {
      title,
      content,
      creator: { connect: { id: self.userId } },
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
        <br />
        <label>Content</label>
        <input name="content" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

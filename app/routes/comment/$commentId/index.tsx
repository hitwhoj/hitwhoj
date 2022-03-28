import { Comment } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/db.server";

type LoaderData = {
  comment: Comment;
};

export const loader: LoaderFunction = ({ params }) => {
  const commentId = invariant(idScheme.safeParse(params.commentId), {
    status: 404,
  });
  const comment = db.comment.findUnique({ where: { id: commentId } });
  return json({ comment });
};

export default function commentIndex() {
  const { comment } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>{comment.title}</h1>
    </>
  );
}

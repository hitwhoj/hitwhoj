import { Comment } from "@prisma/client";
import { LoaderFunction, Outlet, useLoaderData } from "remix";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/db.server";

type LoaderData = {
  comment: Comment;
};

export const loader: LoaderFunction = async ({ params }) => {
  const commentId = invariant(idScheme.safeParse(params.commentId), {
    status: 404,
  });
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
  if (!comment) {
    throw "comment not found";
  }
  return { comment };
};

export default function Comment() {
  const { comment } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>Comment: {comment.title}</h1>
      <button>unused report button</button>
      <Outlet />
    </>
  );
}

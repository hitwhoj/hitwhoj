import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Space, Tag } from "@arco-design/web-react";
import type { Comment, CommentTag } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

type LoaderData = {
  comment: Comment & {
    tags: Pick<CommentTag, "id" | "name">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const commentId = invariant(idScheme, params.commentId, {
    status: 404,
  });
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!comment) {
    throw "comment not found";
  }
  return {
    comment,
  };
};

export default function CommentView() {
  const { comment } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Comment: {comment.title}</h1>
      <h2>标签</h2>
      <Space size="medium">
        {comment.tags.map((tag) => (
          <Link to={`/comment/tag/${tag.name}`} key={tag.id}>
            <Tag>{tag.name}</Tag>
          </Link>
        ))}
      </Space>
      <Outlet />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

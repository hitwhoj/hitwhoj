import type { Comment, User, CommentTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  comments: (Comment & {
    user: Pick<User, "id" | "username" | "avatar">;
    tags: Pick<CommentTag, "name">[];
  })[];
};

export const loader: LoaderFunction = async () => {
  const comments = await db.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      tags: {
        select: {
          name: true,
        },
      },
    },
  });
  return json({ comments });
};

export const meta: MetaFunction = () => ({
  title: "讨论列表 - HITwh OJ",
});

export function CommentItem({
  comment,
}: {
  comment: Comment & {
    user: Pick<User, "id" | "username" | "avatar">;
    tags: Pick<CommentTag, "name">[];
  };
}) {
  return (
    <>
      <img src={comment.user.avatar} alt="没有头像捏" />
      {comment.user.username}

      {"    发布时间:  " + comment.createdAt}
      {"    最近更新:  " + comment.updatedAt}
      {"    标签:  " + comment.tags.map((tag) => tag.name).join(", ")}
      <Link to={`/comment/${comment.id}`}>
        <h2>{comment.title} ←←点这个进入comment页</h2>
      </Link>
    </>
  );
}

export function CommentList({
  comments,
}: {
  comments: (Comment & {
    user: Pick<User, "id" | "username" | "avatar">;
    tags: Pick<CommentTag, "name">[];
  })[];
}) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

export default function CommentListIndex() {
  const { comments } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>latest comments</h1>
      <Link to="new">
        <button>create a comment</button>
      </Link>
      <CommentList comments={comments} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

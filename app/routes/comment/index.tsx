import { Comment, User } from "@prisma/client";
import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  comments: (Comment & {
    user: Pick<User, "uid" | "username" | "avatar">;
  })[];
};

export const loader: LoaderFunction = async () => {
  const comments = await db.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    include: {
      user: {
        select: {
          uid: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
  return json({ comments });
};

export function CommentItem({
  comment,
}: {
  comment: Comment & { user: Pick<User, "uid" | "username" | "avatar"> };
}) {
  return (
    <div className="comment-item">
      <div className="comment-item-header">
        <div className="comment-item-header-left">
          <img src={comment.user.avatar} alt="没有头像捏" />
        </div>
        <div className="comment-item-header-right">
          <div className="comment-item-header-right-username">
            {comment.user.username}
          </div>
          <div className="comment-item-header-right-time">
            {comment.createdAt}
          </div>
        </div>
      </div>
      <Link to={`/comment/${comment.id}`}>
        <h2 className="comment-item-content">
          {comment.title} ←←点这个进入comment页
        </h2>
      </Link>
    </div>
  );
}

export function CommentList({
  comments,
}: {
  comments: (Comment & {
    user: Pick<User, "uid" | "username" | "avatar">;
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

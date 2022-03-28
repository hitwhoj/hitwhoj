import { Comment, Reply, User, CommentTag } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/db.server";

type LoaderData = {
  comment: Comment & {tags: Pick<CommentTag, "name">[] };
  replies: (Reply & {user: Pick<User, "uid" | "username" | "avatar">})[];
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
      tags: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!comment) {
    throw "comment not found";
  }
  const replies = await db.reply.findMany({
    where: { commentId },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });
  return { comment, replies };
};

export function ReplyList({ replies }: {replies: (Reply & {user: Pick<User, "uid" | "username" | "avatar">})[]}) {
  if (!replies.length) {
    return <p>暂无回复</p>;
  } else {
    return (
      <div>
        {replies.map((reply) => (
          <p key={reply.id}>
            <img src={reply.user.avatar} alt="没有头像捏"/>
            {"   " + reply.user.username}
            <h4>{reply.content}</h4>
            Time: {reply.createdAt}
          </p>
        ))}
      </div>
    );
  }
}

export default function Comment() {
  const { comment, replies } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>Comment: {comment.title}</h1>
      Tags:
      {comment.tags.map(tag => tag.name).join(", ")}
      <br/>
      <button>unused report button</button>
      <ReplyList replies={replies}/>
    </>
  );
}

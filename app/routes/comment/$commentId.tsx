import type { Comment, Reply, User, CommentTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import {
  Card,
  Avatar,
  Divider,
  Typography,
  Space,
  Tag,
} from "@arco-design/web-react";
import {
  IconExclamationCircle,
  IconHeart,
  IconMessage,
  IconTag,
} from "@arco-design/web-react/icon";
import { Markdown } from "~/src/Markdown";

type LoaderData = {
  comment: Comment & {
    creator: Pick<User, "id" | "username" | "avatar">;
    tags: Pick<CommentTag, "id" | "name">[];
    replies: (Reply & {
      creator: Pick<User, "id" | "username" | "avatar">;
    })[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const commentId = invariant(idScheme.safeParse(params.commentId), {
    status: 404,
  });
  const comment = await db.comment.findUnique({
    where: { id: commentId },
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
          id: true,
          name: true,
        },
      },
      replies: {
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 20,
      },
    },
  });
  if (!comment) {
    throw "comment not found";
  }
  return { comment };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `讨论: ${data?.comment.title} - HITwh OJ`,
});

function ReplyCard({
  reply,
  index,
}: {
  reply: Reply & {
    creator: Pick<User, "id" | "username" | "avatar">;
  };
  index: number;
}) {
  const author = reply.creator;

  const color = ["orange", "green", "blue", "purple", "magenta", "gold"];

  const Title = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          style={{
            marginRight: 8,
            backgroundColor: color[Math.floor(Math.random() * color.length)],
          }}
          size={32}
        >
          {author.avatar ? (
            <img src={author.avatar} alt="加载失败捏" />
          ) : (
            author.username[0]
          )}
        </Avatar>
        <Typography.Text>{author.username}</Typography.Text>
        <Typography.Text>
          &emsp;@{reply.createdAt.toLocaleString().slice(0, 16)}
        </Typography.Text>
      </span>
      <Space size={24}>
        <Space size={8}>
          <IconTag />
          {"#" + index}
        </Space>
        <Space size={8}>
          <IconHeart />
          <Typography.Text>收藏 : 42</Typography.Text>
        </Space>
        <Space size={8}>
          <IconMessage />
          <Typography.Text>回复 : 63</Typography.Text>
        </Space>
        <Space size={8}>
          <IconExclamationCircle />
          <Typography.Text>举报 : 0</Typography.Text>
        </Space>
      </Space>
    </div>
  );
  return (
    <Card title={<Title />} style={{ borderColor: "#4E5969" }}>
      <Markdown>{reply.content}</Markdown>
    </Card>
  );
}

export function ReplyList({
  replies,
}: {
  replies: (Reply & { creator: Pick<User, "id" | "username" | "avatar"> })[];
}) {
  if (!replies.length) {
    return <p>暂无回复</p>;
  } else {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {replies.map((reply, index) => (
          <ReplyCard key={reply.id} reply={reply} index={index} />
        ))}
      </Space>
    );
  }
}

export default function CommentView() {
  const { comment } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>Comment: {comment.title}</h1>
      <h2>标签</h2>
      <Space size="medium">
        <Link to={`/comment/tag/example`} key="example">
          <Tag>#example</Tag>
        </Link>
        <Link to={`/comment/tag/math`} key="math">
          <Tag>#math</Tag>
        </Link>
      </Space>
      <Divider />
      <ReplyList replies={comment.replies} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

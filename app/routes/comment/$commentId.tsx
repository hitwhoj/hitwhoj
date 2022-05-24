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
  IconExclamationCircleFill,
  IconHeart,
  IconHeartFill,
  IconMessage,
  IconTag,
} from "@arco-design/web-react/icon";
import { Markdown } from "~/src/Markdown";
import { findSessionUid } from "~/utils/sessions";
import { Like } from "~/routes/comment/index";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

enum ActionType {
  None = "none",
  Heart = "heart",
  UnHeart = "unheart",
}

export const action: ActionFunction = async ({ request }) => {
  const self = await findSessionUid(request);

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.None: {
      return null;
    }
    case ActionType.Heart: {
      const id = invariant(idScheme.safeParse(form.get("id")), {
        status: 404,
      });
      await db.reply.update({
        where: { id },
        data: {
          heartees: {
            connect: {
              id: self,
            },
          },
        },
      });
      return null;
    }
    case ActionType.UnHeart: {
      const id = invariant(idScheme.safeParse(form.get("id")), {
        status: 404,
      });
      await db.reply.update({
        where: { id },
        data: {
          heartees: {
            disconnect: {
              id: self,
            },
          },
        },
      });
      return null;
    }
  }
  return null;
};

type LoaderData = {
  comment: Comment & {
    creator: Pick<User, "id" | "nickname" | "avatar">;
    tags: Pick<CommentTag, "id" | "name">[];
    heartees: Pick<User, "id">[];
    reportees: Pick<User, "id">[];
    replies: (Reply & {
      creator: Pick<User, "id" | "nickname" | "avatar">;
      replyTo:
        | (Pick<Reply, "content"> & { creator: Pick<User, "id" | "nickname"> })
        | null;
      heartees: Pick<User, "id">[];
      reportees: Pick<User, "id">[];
      replies: Pick<Reply, "id">[];
    })[];
  };
  self: number;
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const commentId = invariant(idScheme.safeParse(params.commentId), {
    status: 404,
  });
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
        },
      },
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      heartees: {
        select: {
          id: true,
        },
      },
      reportees: {
        select: {
          id: true,
        },
      },
      replies: {
        include: {
          creator: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          replyTo: {
            include: {
              creator: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
          },
          heartees: {
            select: {
              id: true,
            },
          },
          reportees: {
            select: {
              id: true,
            },
          },
          replies: {
            select: {
              id: true,
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
  const self = await findSessionUid(request);
  if (!self) {
    return {
      comment,
      self: -1,
    };
  }
  return { comment, self };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `讨论: ${data?.comment.title} - HITwh OJ`,
});

function Title({
  reply,
  self,
  index,
}: {
  reply: LoaderData["comment"]["replies"][number];
  self: number;
  index: number;
}) {
  const color = ["orange", "green", "blue", "purple", "magenta", "gold"];

  const author = reply.creator;

  return (
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
            author.nickname[0]
          )}
        </Avatar>
        <Typography.Text>{author.nickname}</Typography.Text>
        <Typography.Text>
          &emsp;@{reply.createdAt.toLocaleString().slice(0, 16)}
        </Typography.Text>
      </span>
      <Space size={24}>
        <Like
          props={{
            id: reply.id,
            count: index,
            likeAction: ActionType.None,
            likeElement: (
              <>
                <IconTag style={{ fontSize: "1.1em" }} /> #{" "}
              </>
            ),
            style: { fontSize: "1.18em" },
          }}
        />
        <Like
          props={{
            id: reply.id,
            like: reply.heartees.map((u) => u.id).includes(self),
            count: reply.heartees.length,
            likeAction: ActionType.Heart,
            dislikeAction: ActionType.UnHeart,
            likeElement: (
              <>
                <IconHeartFill
                  style={{ color: "#f53f3f", fontSize: "1.1em" }}
                />{" "}
                #{" "}
              </>
            ),
            dislikeElement: (
              <>
                <IconHeart style={{ fontSize: "1.1em" }} /> #{" "}
              </>
            ),
            style: { fontSize: "1.18em" },
          }}
        />
        <Like
          props={{
            id: reply.id,
            count: reply.replies.length,
            likeAction: ActionType.None,
            likeElement: (
              <>
                <IconMessage style={{ fontSize: "1.1em" }} /> #{" "}
              </>
            ),
            style: { fontSize: "1.18em" },
          }}
        />
        <Like
          props={{
            id: reply.id,
            like: reply.reportees.map((u) => u.id).includes(self),
            count: reply.reportees.length,
            likeAction: ActionType.None,
            dislikeAction: ActionType.None,
            likeElement: (
              <IconExclamationCircleFill
                style={{ color: "#F53F3F", fontSize: "1.1em" }}
              />
            ),
            dislikeElement: (
              <>
                {reply.reportees.length > 0 ? (
                  <IconExclamationCircle
                    style={{ color: "#F53F3F", fontSize: "1.1em" }}
                  />
                ) : (
                  <IconExclamationCircle style={{ fontSize: "1.1em" }} />
                )}{" "}
                #
              </>
            ),
            style: { fontSize: "1.18em" },
          }}
        />
      </Space>
    </div>
  );
}

function ReplyCard({
  reply,
  self,
  index,
}: {
  reply: LoaderData["comment"]["replies"][number];
  self: LoaderData["self"];
  index: number;
}) {
  // const replyTo = reply.replyTo;

  return (
    <Card
      title={<Title reply={reply} self={self} index={index} />}
      style={{ borderColor: "#4E5969" }}
    >
      <Markdown>{reply.content}</Markdown>
    </Card>
  );
}

export function ReplyList({
  replies,
  self,
}: {
  replies: LoaderData["comment"]["replies"];
  self: LoaderData["self"];
}) {
  if (!replies.length) {
    return <p>暂无回复</p>;
  } else {
    return (
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {replies.map((reply, index) => (
          <ReplyCard key={reply.id} reply={reply} self={self} index={index} />
        ))}
      </Space>
    );
  }
}

export default function CommentView() {
  const { comment, self } = useLoaderData<LoaderData>();
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
      <ReplyList replies={comment.replies} self={self} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import type { Comment, Reply, User, CommentTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, Form } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme, replyContentScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import {
  Card,
  Avatar,
  Divider,
  Typography,
  Space,
  Tag,
  Form as arcoForm,
  Button,
  Input,
  InputNumber,
  Modal,
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
import { Like } from "~/routes/comment";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useState } from "react";

const FormItem = arcoForm.Item;
const TextArea = Input.TextArea;

enum ActionType {
  None = "none",
  Heart = "heart",
  UnHeart = "unheart",
  Reply = "reply",
  ReplyTo = "replyTo",
}

export const action: ActionFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);
  const commentId = invariant(idScheme.safeParse(params.commentId), {
    status: 404,
  });

  if (!self) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.None: {
      console.log("none");
      return null;
    }
    case ActionType.Heart: {
      const replyId = invariant(idScheme.safeParse(form.get("id")), {
        status: 404,
      });
      await db.reply.update({
        where: { id: replyId },
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
      const replyId = invariant(idScheme.safeParse(form.get("id")), {
        status: 404,
      });
      await db.reply.update({
        where: { id: replyId },
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
    case ActionType.Reply: {
      const content = invariant(
        replyContentScheme.safeParse(form.get("content")),
        {
          status: 400,
        }
      );
      await db.reply.create({
        data: {
          content,
          creator: {
            connect: {
              id: self,
            },
          },
          comment: {
            connect: {
              id: commentId,
            },
          },
        },
      });
      return null;
    }
    case ActionType.ReplyTo: {
      const content = invariant(
        replyContentScheme.safeParse(form.get("content")),
        {
          status: 400,
        }
      );
      const replyToId = invariant(idScheme.safeParse(form.get("replyToId")), {
        status: 404,
      });
      await db.reply.create({
        data: {
          content,
          creator: {
            connect: {
              id: self,
            },
          },
          comment: {
            connect: {
              id: commentId,
            },
          },
          replyTo: {
            connect: {
              id: replyToId,
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

  const likeStyle = { fontSize: "0.9rem" };

  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Modal
        title="New Reply"
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <NewReplyTo
          replyToId={reply.id}
          onCancel={() => {
            setVisible(false);
          }}
          onReply={() => {
            setVisible(false);
          }}
        />
      </Modal>
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
      <Space size={16}>
        <Like
          props={{
            id: reply.id,
            count: index,
            likeAction: ActionType.None,
            likeElement: (
              <>
                <IconTag /> #{" "}
              </>
            ),
            style: likeStyle,
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
                <IconHeartFill style={{ color: "#f53f3f" }} /> Star{" "}
              </>
            ),
            dislikeElement: (
              <>
                <IconHeart /> Star{" "}
              </>
            ),
            style: likeStyle,
          }}
        />
        <Button
          type="text"
          onClick={() => {
            setVisible(true);
          }}
          style={{}}
        >
          <Like
            props={{
              id: reply.id,
              count: reply.replies.length,
              likeAction: ActionType.None,
              likeElement: (
                <>
                  <IconMessage /> Reply{" "}
                </>
              ),
              style: likeStyle,
            }}
          />
        </Button>
        <Like
          props={{
            id: reply.id,
            like: reply.reportees.map((u) => u.id).includes(self),
            count: reply.reportees.length,
            likeAction: ActionType.None,
            dislikeAction: ActionType.None,
            likeElement: (
              <>
                <IconExclamationCircleFill style={{ color: "#F53F3F" }} />{" "}
                Report
              </>
            ),
            dislikeElement: (
              <>
                {reply.reportees.length > 0 ? (
                  <IconExclamationCircle style={{ color: "#F53F3F" }} />
                ) : (
                  <IconExclamationCircle />
                )}{" "}
                Report
              </>
            ),
            style: likeStyle,
          }}
        />
      </Space>
    </div>
  );
}

function ReplyTo({
  replyTo,
}: {
  replyTo: LoaderData["comment"]["replies"][number]["replyTo"];
}) {
  if (!replyTo) {
    return null;
  }
  return (
    <Card>
      <Link to={"/user/" + replyTo.creator.id} style={{ color: "#165DFF" }}>
        @{replyTo.creator.nickname} :
      </Link>
      <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>
        <Markdown>{replyTo.content}</Markdown>
      </Typography.Paragraph>
    </Card>
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
  return (
    <Card
      title={<Title reply={reply} self={self} index={index} />}
      style={{ borderColor: "#4E5969" }}
    >
      <ReplyTo replyTo={reply.replyTo} />
      <Markdown>{reply.content}</Markdown>
    </Card>
  );
}

function ReplyList({
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

function NewReply() {
  const [content, setContent] = useState<string>("");

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        alignItems: "end",
        flexDirection: "column",
        width: "100%",
      }}
      onSubmit={() => setContent("")}
    >
      <FormItem wrapperCol={{ span: 24 }}>
        <TextArea
          name="content"
          rows={6}
          placeholder={`please make your reply more than 8 characters`}
          minLength={8}
          maxLength={1000}
          value={content}
          onChange={(e) => {
            setContent(e);
            console.log(e);
          }}
        />
      </FormItem>
      <Button
        type="primary"
        htmlType="submit"
        name="_action"
        value={ActionType.Reply}
        style={{ width: "220px" }}
      >
        Reply !
      </Button>
    </Form>
  );
}

function NewReplyTo({
  replyToId,
  onCancel,
  onReply,
}: {
  replyToId: number;
  onCancel: () => void;
  onReply: () => void;
}) {
  const [content, setContent] = useState<string>("");

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        alignItems: "end",
        flexDirection: "column",
        width: "100%",
      }}
      onSubmit={() => setContent("")}
    >
      <FormItem hidden>
        <InputNumber name="replyToId" value={replyToId} />
      </FormItem>
      <FormItem wrapperCol={{ span: 24 }}>
        <TextArea
          name="content"
          rows={4}
          placeholder={`please make your reply more than 8 characters`}
          minLength={8}
          maxLength={1000}
          value={content}
          onChange={(e) => {
            setContent(e);
            console.log(e);
          }}
        />
      </FormItem>
      <Space size={16}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          htmlType="submit"
          name="_action"
          value={ActionType.ReplyTo}
          onClick={onReply}
        >
          Reply !
        </Button>
      </Space>
    </Form>
  );
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
      <Divider />
      <NewReply />
      <Divider />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

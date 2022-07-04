import type { Comment, Reply, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { idScheme, replyContentScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import {
  Card,
  Comment as ArcoComment,
  Divider,
  Typography,
  Space,
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
} from "@arco-design/web-react/icon";
import { Markdown } from "~/src/Markdown";
import { findSessionUid } from "~/utils/sessions";
import { Like } from "~/src/comment/like";
import { Avatar } from "~/src/comment/avatar";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useState } from "react";

const FormItem = arcoForm.Item;
const TextArea = Input.TextArea;

enum ActionType {
  None = "none",
  CommentHeart = "commentHeart",
  CommentUnHeart = "commentUnHeart",
  Heart = "heart",
  UnHeart = "unheart",
  Reply = "reply",
  ReplyTo = "replyTo",
  ReplyToSub = "replyToSub",
}

export const action: ActionFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);
  const commentId = invariant(idScheme, params.commentId);

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
    case ActionType.CommentHeart: {
      const id = invariant(idScheme, form.get("id"));
      await db.comment.update({
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
    case ActionType.CommentUnHeart: {
      const id = invariant(idScheme, form.get("id"));
      await db.comment.update({
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
    case ActionType.Heart: {
      const replyId = invariant(idScheme, form.get("id"));
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
      const replyId = invariant(idScheme, form.get("id"));
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
      const content = invariant(replyContentScheme, form.get("content"));
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
      const content = invariant(replyContentScheme, form.get("content"));
      const replyToId = invariant(idScheme, form.get("replyToId"));
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
          domReply: {
            connect: {
              id: replyToId,
            },
          },
        },
      });
      return null;
    }
    case ActionType.ReplyToSub: {
      const content = invariant(replyContentScheme, form.get("content"));
      const domId = invariant(idScheme, form.get("domId"));
      const replyToId = invariant(idScheme, form.get("replyToId"));
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
          domReply: {
            connect: {
              id: domId,
            },
          },
          replyTo: {
            connect: {
              id: replyToId,
            },
          },
        },
      });
    }
  }
  return null;
};

type LoaderData = {
  comment: Comment & {
    creator: Pick<User, "id" | "nickname" | "avatar">;
    heartees: Pick<User, "id">[];
    reportees: Pick<User, "id">[];
    replies: (Reply & {
      creator: Pick<User, "id" | "nickname" | "avatar">;
      subReplies: (Reply & {
        replyTo:
          | (Pick<Reply, "content"> & {
              creator: Pick<User, "id" | "nickname">;
            })
          | null;
      })[];
      heartees: Pick<User, "id">[];
      reportees: Pick<User, "id">[];
    })[];
  };
  self: number;
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const commentId = invariant(idScheme, params.commentId, {
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
          subReplies: {
            include: {
              replyTo: {
                select: {
                  content: true,
                  creator: {
                    select: {
                      id: true,
                      nickname: true,
                    },
                  },
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

  // 过滤二级回复
  comment.replies = comment.replies.filter((reply) => reply.domId === null);

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

function CommentTitle({
  comment,
  self,
}: {
  comment: LoaderData["comment"];
  self: LoaderData["self"];
}) {
  const author = comment.creator;

  const likeStyle = { fontSize: "0.9rem" };
  const likeButtonStyle = { width: "6.5rem", padding: "0.1rem" };

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
          replyToId={0}
          onReply={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          action={ActionType.Reply}
        />
      </Modal>
      <span style={{ display: "flex", alignItems: "center" }}>
        <Avatar src={author.avatar} name={author.nickname} size={32} />
        <Typography.Text>{author.nickname}</Typography.Text>
        <Typography.Text>
          &emsp;@{comment.createdAt.toLocaleString().slice(0, 16)}
        </Typography.Text>
      </span>
      <Space size={8}>
        {/* TODO : 套一层 Button 会导致多一次 None 的提交请求 */}
        <Button type="text" size="small" style={likeButtonStyle}>
          <Like
            props={{
              id: comment.id,
              like: comment.heartees.map((u) => u.id).includes(self),
              count: comment.heartees.length,
              likeAction: ActionType.CommentHeart,
              dislikeAction: ActionType.CommentUnHeart,
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
        </Button>
        <Button
          type="text"
          size="small"
          onClick={() => {
            setVisible(true);
          }}
          style={likeButtonStyle}
        >
          <Like
            props={{
              id: comment.id,
              like: comment.replies.map((u) => u.creatorId).includes(self),
              count: comment.replies.length,
              likeAction: ActionType.None,
              likeElement: (
                <>
                  <IconMessage style={{ color: "#00B42A" }} /> Reply{" "}
                </>
              ),
              dislikeElement: (
                <>
                  <IconMessage /> Reply{" "}
                </>
              ),
              style: likeStyle,
              preload: false,
            }}
          />
        </Button>
        {/* TODO : 举办机制与页面没做 */}
        <Button type="text" size="small" style={likeButtonStyle}>
          <Like
            props={{
              id: comment.id,
              like: comment.reportees.map((u) => u.id).includes(self),
              count: comment.reportees.length,
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
                  {comment.reportees.length > 0 ? (
                    <IconExclamationCircle style={{ color: "#F53F3F" }} />
                  ) : (
                    <IconExclamationCircle />
                  )}{" "}
                  Report
                </>
              ),
              style: likeStyle,
              preload: false,
            }}
          />
        </Button>
      </Space>
    </div>
  );
}

function CommentCard({
  comment,
  self,
}: {
  comment: LoaderData["comment"];
  self: LoaderData["self"];
}) {
  return (
    <Card
      title={<CommentTitle comment={comment} self={self} />}
      style={{ borderColor: "#4E5969" }}
    >
      <Markdown>{comment.content}</Markdown>
    </Card>
  );
}

function ReplyCard({
  reply,
  self,
}: {
  reply: LoaderData["comment"]["replies"][number];
  self: LoaderData["self"];
}) {
  const author = reply.creator;

  const likeStyle = { fontSize: "0.9rem" };
  const likeButtonStyle = {
    width: "2.5rem",
    height: "1.3rem",
    padding: "0.1rem",
  };

  const [visible, setVisible] = useState(false);

  const actions = (
    <Space size={2}>
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
          action={ActionType.ReplyTo}
        />
      </Modal>
      <Button type="text" size="mini" style={likeButtonStyle}>
        <Like
          props={{
            id: reply.id,
            like: reply.heartees.map((u) => u.id).includes(self),
            count: reply.heartees.length,
            likeAction: ActionType.Heart,
            dislikeAction: ActionType.UnHeart,
            likeElement: (
              <>
                <IconHeartFill style={{ color: "#f53f3f" }} />{" "}
              </>
            ),
            dislikeElement: (
              <>
                <IconHeart />{" "}
              </>
            ),
            style: likeStyle,
          }}
        />
      </Button>
      <Button
        type="text"
        size="mini"
        onClick={() => {
          setVisible(true);
        }}
        style={likeButtonStyle}
      >
        <Like
          props={{
            id: reply.id,
            like: reply.subReplies.map((u) => u.creatorId).includes(self),
            count: reply.subReplies.length,
            likeAction: ActionType.None,
            likeElement: (
              <>
                <IconMessage style={{ color: "#00B42A" }} />{" "}
              </>
            ),
            dislikeElement: (
              <>
                <IconMessage />{" "}
              </>
            ),
            style: likeStyle,
            preload: false,
          }}
        />
      </Button>
      {/* TODO : 举办机制与页面没做 */}
      <Button type="text" size="mini" style={likeButtonStyle}>
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
              </>
            ),
            dislikeElement: (
              <>
                {reply.reportees.length > 0 ? (
                  <IconExclamationCircle style={{ color: "#F53F3F" }} />
                ) : (
                  <IconExclamationCircle />
                )}{" "}
              </>
            ),
            style: likeStyle,
            preload: false,
          }}
        />
      </Button>
    </Space>
  );

  // TODO: 二级评论

  return (
    <ArcoComment
      actions={actions}
      author={author.nickname}
      // align="right"
      key={"reply" + reply.id}
      avatar={<Avatar src={author.avatar} name={author.nickname} />}
      content={<div>{reply.content}</div>}
      datetime={reply.createdAt.toLocaleString().slice(0, 16)}
    />
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
      <>
        <br />
        {replies.map((reply, index) => (
          <ReplyCard reply={reply} self={self} key={index} />
        ))}
      </>
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
  action,
}: {
  replyToId: number;
  onCancel: () => void;
  onReply: () => void;
  action: ActionType;
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
          value={action}
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
      <Divider />
      <CommentCard comment={comment} self={self} />
      <ReplyList replies={comment.replies} self={self} />
      <Divider />
      <NewReply />
      <Divider />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

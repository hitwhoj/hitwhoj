import { json } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
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
import { Like } from "~/src/comment/Like";
import { redirect } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderArgs,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";
import { useState } from "react";
import { ReportType } from "@prisma/client";
import { formatDateTime } from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import { UserLink } from "~/src/user/UserLink";
import { UserAvatar } from "~/src/user/UserAvatar";

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
  const self = await findRequestUser(request);
  const commentId = invariant(idScheme, params.commentId);

  if (!self.userId) {
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
              id: self.userId,
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
              id: self.userId,
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
              id: self.userId,
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
              id: self.userId,
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
              id: self.userId,
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
      const domId = invariant(idScheme, form.get("domId"));
      await db.reply.create({
        data: {
          content,
          creator: {
            connect: {
              id: self.userId,
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
              id: self.userId,
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

export async function loader({ params, request }: LoaderArgs) {
  const commentId = invariant(idScheme, params.commentId, { status: 404 });
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      creator: true,
      heartees: {
        select: {
          id: true,
        },
      },
      reports: {
        select: {
          creatorId: true,
        },
      },
      replies: {
        include: {
          creator: true,
          subReplies: {
            include: {
              creator: true,
              heartees: {
                select: {
                  id: true,
                },
              },
              reports: {
                select: {
                  creatorId: true,
                },
              },
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
          reports: {
            select: {
              creatorId: true,
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
  const self = await findRequestUser(request);

  // 过滤二级回复
  comment.replies = comment.replies.filter((reply) => reply.domId === null);

  return json({ comment, self: self.userId ?? -1 });
}

type LoaderData = SerializeFrom<typeof loader>;

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
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
          onReply={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          action={ActionType.Reply}
        />
      </Modal>
      <span style={{ display: "flex", alignItems: "center" }}>
        <UserAvatar user={author} />
        <Typography.Text>
          <UserLink user={author} />
        </Typography.Text>
        <Typography.Text>@{formatDateTime(comment.createdAt)}</Typography.Text>
      </span>
      <Space size={8}>
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
            onClick: () => {
              setVisible(true);
            },
          }}
        />
        <Link to={`/comment/report/${ReportType.C + comment.id}`}>
          <Like
            props={{
              id: comment.id,
              like: comment.reports.map((r) => r.creatorId).includes(self),
              count: comment.reports.length,
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
                  {comment.reports.length > 0 ? (
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
        </Link>
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

function SubReplyCard({
  self,
  reply,
}: {
  self: LoaderData["self"];
  reply: LoaderData["comment"]["replies"][number]["subReplies"][number];
}) {
  const author = reply.creator;

  const replyTo = reply.replyTo ? (
    <Link to={`/user/${reply.replyTo.creator.id}`}>
      {"@" + reply.replyTo.creator.nickname + ": "}
    </Link>
  ) : (
    ""
  );

  const likeStyles = {
    fontSize: "0.9rem",
    width: "2.5rem",
    height: "1.5rem",
    padding: "0 0.3rem",
  };

  const [visible, setVisible] = useState(false);

  const actions = (
    <Space size={2}>
      <Modal
        title={`New Reply To #${reply.id}`}
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <NewReplyTo
          domId={reply.domId!}
          replyToId={reply.id}
          onCancel={() => {
            setVisible(false);
          }}
          onReply={() => {
            setVisible(false);
          }}
          action={ActionType.ReplyToSub}
        />
      </Modal>
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
          style: likeStyles,
        }}
      />
      <Like
        props={{
          id: reply.id,
          likeAction: ActionType.None,
          likeElement: (
            <>
              <IconMessage />{" "}
            </>
          ),
          style: likeStyles,
          preload: false,
          onClick: () => {
            setVisible(true);
          },
        }}
      />
      <Link to={`/comment/report/${ReportType.R + reply.id}`}>
        <Like
          props={{
            id: reply.id,
            like: reply.reports.map((r) => r.creatorId).includes(self),
            count: reply.reports.length,
            likeAction: ActionType.None,
            dislikeAction: ActionType.None,
            likeElement: (
              <>
                <IconExclamationCircleFill style={{ color: "#F53F3F" }} />{" "}
              </>
            ),
            dislikeElement: (
              <>
                {reply.reports.length > 0 ? (
                  <IconExclamationCircle style={{ color: "#F53F3F" }} />
                ) : (
                  <IconExclamationCircle />
                )}{" "}
              </>
            ),
            style: likeStyles,
            preload: false,
          }}
        />
      </Link>
    </Space>
  );

  return (
    <ArcoComment
      actions={actions}
      author={<UserLink user={author} />}
      key={"reply" + reply.id}
      avatar={<UserAvatar user={author} />}
      content={
        <div>
          {replyTo}
          <span>{reply.content}</span>
        </div>
      }
      datetime={formatDateTime(reply.createdAt)}
    />
  );
}

function ReplyCard({
  self,
  reply,
}: {
  self: LoaderData["self"];
  reply: LoaderData["comment"]["replies"][number];
}) {
  const author = reply.creator;

  const likeStyles = {
    fontSize: "0.9rem",
    width: "2.5rem",
    height: "1.5rem",
    padding: "0 0.3rem",
  };

  const [visible, setVisible] = useState(false);

  const actions = (
    <Space size={2}>
      <Modal
        title={`New Reply To #${reply.id}`}
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <NewReplyTo
          domId={reply.id}
          onCancel={() => {
            setVisible(false);
          }}
          onReply={() => {
            setVisible(false);
          }}
          action={ActionType.ReplyTo}
        />
      </Modal>
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
          style: likeStyles,
        }}
      />
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
          style: likeStyles,
          preload: false,
          onClick: () => {
            setVisible(true);
          },
        }}
      />
      <Link to={`/comment/report/${ReportType.R + reply.id}`}>
        <Like
          props={{
            id: reply.id,
            like: reply.reports.map((r) => r.creatorId).includes(self),
            count: reply.reports.length,
            likeAction: ActionType.None,
            dislikeAction: ActionType.None,
            likeElement: (
              <>
                <IconExclamationCircleFill style={{ color: "#F53F3F" }} />{" "}
              </>
            ),
            dislikeElement: (
              <>
                {reply.reports.length > 0 ? (
                  <IconExclamationCircle style={{ color: "#F53F3F" }} />
                ) : (
                  <IconExclamationCircle />
                )}{" "}
              </>
            ),
            style: likeStyles,
            preload: false,
          }}
        />
      </Link>
    </Space>
  );

  return (
    <ArcoComment
      actions={actions}
      author={<UserLink user={author} />}
      key={"reply" + reply.id}
      avatar={<UserAvatar user={author} />}
      content={<div>{reply.content}</div>}
      datetime={formatDateTime(reply.createdAt)}
    >
      {reply.subReplies.map((subReply, index) => (
        <SubReplyCard reply={subReply} self={self} key={index} />
      ))}
    </ArcoComment>
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
  domId,
  replyToId,
  onCancel,
  onReply,
  action,
}: {
  domId?: number;
  replyToId?: number;
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
      <FormItem hidden>
        <InputNumber name="domId" value={domId} />
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

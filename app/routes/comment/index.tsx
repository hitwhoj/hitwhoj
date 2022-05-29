import type { Comment, User, Reply } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Table, Grid, Button, Space } from "@arco-design/web-react";
import {
  IconExclamationCircle,
  IconExclamationCircleFill,
  IconHeart,
  IconHeartFill,
  IconMessage,
  IconStarFill,
  IconThumbUp,
} from "@arco-design/web-react/icon";
import type { CSSProperties } from "react";
import { findSessionUid } from "~/utils/sessions";
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

export type likeProps = {
  id: number;
  like?: boolean | undefined;
  count: number;
  likeAction: string;
  dislikeAction?: string;
  likeElement: JSX.Element;
  dislikeElement?: JSX.Element;
  style?: CSSProperties | undefined;
  action?: ActionFunction | undefined;
};

export function Like({ props }: { props: likeProps }) {
  if (props.like === undefined) {
    props.like = false;
    props.dislikeAction = props.likeAction;
    props.dislikeElement = props.likeElement;
  }
  const fetcher = useFetcher();
  const isFetching = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="id" value={props.id} />
      <input type="hidden" />
      <button
        type="submit"
        name="_action"
        value={props.like ? props.dislikeAction : props.likeAction}
        disabled={isFetching}
      >
        {isFetching ? (
          <div style={props.style}>
            {!props.like ? props.likeElement : props.dislikeElement}{" "}
            {props.count + (props.like ? -1 : 1)}
          </div>
        ) : (
          <div style={props.style}>
            {props.like ? props.likeElement : props.dislikeElement}{" "}
            {props.count}
          </div>
        )}
      </button>
    </fetcher.Form>
  );
}

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
    case ActionType.UnHeart: {
      const id = invariant(idScheme.safeParse(form.get("id")), {
        status: 404,
      });
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
  }
  return null;
};

type LoaderData = {
  comments: (Pick<Comment, "id" | "title" | "createdAt" | "updatedAt"> & {
    creator: Pick<User, "id" | "nickname">;
    heartees: Pick<User, "id" | "nickname">[];
    replies: Pick<Reply, "id" | "creatorId">[];
    reportees: Pick<User, "id">[];
  })[];
  self: number;
};

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  const comments = await db.comment.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 20,
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
        },
      },
      heartees: {
        select: {
          id: true,
          nickname: true,
        },
      },
      replies: {
        select: {
          id: true,
          creatorId: true,
        },
      },
      reportees: {
        select: {
          id: true,
        },
      },
    },
  });
  const self = await findSessionUid(request);
  if (!self) {
    return {
      comments,
      self: -1,
    };
  }
  return { comments, self };
};

export const meta: MetaFunction = () => ({
  title: "讨论列表 - HITwh OJ",
});

export function CommentList({
  comments,
  self,
}: {
  comments: LoaderData["comments"];
  self: LoaderData["self"];
}) {
  type CommentDetails = typeof comments[number];
  const tableColumns = [
    {
      title: "Forum",
      render: (_: any, comment: CommentDetails) => (
        <Link to={`/comment/forum/${comment.id}`}>
          P123: A + B Problem 公告版
        </Link>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (col: string, comment: CommentDetails) => (
        <Link
          to={`/comment/${comment.id}`}
          // TODO: 写个hover样式qwq
          style={{}}
        >
          {col}
        </Link>
      ),
    },
    {
      title: (
        <Space size={12}>
          <IconHeart />
          <IconStarFill />
          <IconThumbUp />
          <IconMessage />
        </Space>
      ),
      render: (_: any, comment: CommentDetails) => (
        <Space size={6}>
          <Like
            props={{
              id: comment.id,
              like: comment.heartees.map((u) => u.id).includes(self),
              count: comment.heartees.length,
              likeAction: ActionType.Heart,
              dislikeAction: ActionType.UnHeart,
              likeElement: <IconHeartFill style={{ color: "#f53f3f" }} />,
              dislikeElement: <IconHeart />,
              style: { fontSize: "1rem" },
            }}
          />
          <Link to={`/comment/${comment.id}`}>
            <Like
              props={{
                id: comment.id,
                like: comment.replies.map((u) => u.creatorId).includes(self),
                count: comment.replies.length,
                likeAction: ActionType.None,
                dislikeAction: ActionType.None,
                likeElement: <IconMessage style={{ color: "#00B42A" }} />,
                dislikeElement: <IconMessage />,
                style: { fontSize: "1rem" },
              }}
            />
          </Link>
          <Link to={`/comment/${comment.id}/report`}>
            <Like
              props={{
                id: comment.id,
                like: comment.reportees.map((u) => u.id).includes(self),
                count: comment.reportees.length,
                likeAction: ActionType.None,
                dislikeAction: ActionType.None,
                likeElement: (
                  <IconExclamationCircleFill style={{ color: "#F53F3F" }} />
                ),
                dislikeElement:
                  comment.reportees.length > 0 ? (
                    <IconExclamationCircle style={{ color: "#F53F3F" }} />
                  ) : (
                    <IconExclamationCircle />
                  ),
                style: { fontSize: "1rem" },
              }}
            />
          </Link>
        </Space>
      ),
    },
    {
      title: "Author",
      render: (_: any, comment: CommentDetails) => (
        <Link to={`/user/${comment.creator.id}`}>
          {comment.creator.nickname}
          {" @"}
          {comment.createdAt.toLocaleString()}
        </Link>
      ),
    },
  ];
  return (
    <Table
      columns={tableColumns}
      data={comments}
      hover={false}
      pagination={{
        total: comments.length,
        defaultPageSize: 20,
        showTotal: (total: number) => `Total ${Math.ceil(total / 20)} pages`,
        showJumper: true,
      }}
    />
  );
}

export default function CommentListIndex() {
  const { comments, self } = useLoaderData<LoaderData>();

  return (
    <>
      <Grid.Row
        justify="end"
        align="center"
        style={{
          height: "3rem",
        }}
      >
        <Link to="new">
          <Button type="primary">Create comment</Button>
        </Link>
      </Grid.Row>
      <CommentList comments={comments} self={self} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

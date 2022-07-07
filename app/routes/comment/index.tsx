import type { Comment, User, Reply } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Table, Grid, Button, Space, Typography } from "@arco-design/web-react";
import {
  IconExclamationCircle,
  IconExclamationCircleFill,
  IconHeart,
  IconHeartFill,
  IconMessage,
  IconPlus,
  // IconStarFill,
  // IconThumbUp,
} from "@arco-design/web-react/icon";
import { findSessionUid } from "~/utils/sessions";
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { useContext } from "react";
import { UserInfoContext } from "~/utils/context/user";
import { Like } from "~/src/comment/Like";
import type { CommentTag as CommentTagType } from "@prisma/client";
import { CommentTag } from "~/src/comment/CommentTag";
import { formatDateTime } from "~/utils/tools";

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
    case ActionType.UnHeart: {
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
  }
  return null;
};

type LoaderData = {
  comments: (Pick<Comment, "id" | "title" | "createdAt" | "updatedAt"> & {
    creator: Pick<User, "id" | "nickname">;
    tags: Pick<CommentTagType, "id" | "name">[];
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
      tags: {
        select: {
          id: true,
          name: true,
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
      title: "Title",
      dataIndex: "title",
      render: (col: string, comment: CommentDetails) => (
        <>
          <Space size={6}>
            <Link
              to={`/comment/${comment.id}`}
              // TODO: 写个hover样式qwq
              style={{}}
            >
              {col}
            </Link>
            {comment.tags.slice(0, 3).map((tag) => (
              <Link to={`/comment/tag/${tag.name}`} key={tag.id}>
                <CommentTag name={tag.name} />
              </Link>
            ))}
          </Space>
        </>
      ),
    },
    // {
    //   title: "Tags",
    //   render: (col: string[], comment: CommentDetails) => (
    //     <Link to={`/comment/tag/${comment.id}`}>
    //       {col}
    //     </Link>
    //   ),
    // },
    {
      title: "Stars",
      // title: (
      //   <Space size={12}>
      //     <IconHeart />
      //     <IconStarFill />
      //     <IconThumbUp />
      //     <IconMessage />
      //   </Space>
      // ),
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
          {" @ "}
          {formatDateTime(comment.createdAt)}
        </Link>
      ),
    },
  ];
  return (
    <Table
      columns={tableColumns}
      data={comments}
      rowKey="id"
      hover={false}
      border={false}
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
  const user = useContext(UserInfoContext);

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          讨论列表
          {user && (
            <Link to="new">
              <Button type="primary" icon={<IconPlus />}>
                新建讨论
              </Button>
            </Link>
          )}
        </Grid.Row>
      </Typography.Title>
      <Typography.Paragraph>
        <CommentList comments={comments} self={self} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

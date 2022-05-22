import type { Comment, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { Table, Grid, Button, Space } from "@arco-design/web-react";
import {
  IconExclamationCircle,
  // IconExclamationCircleFill,
  IconHeart,
  // IconHeartFill,
  IconMessage,
  // IconStar,
  IconStarFill,
  IconThumbUp,
  // IconThumbUpFill
} from "@arco-design/web-react/icon";

type LoaderData = {
  comments: (Pick<Comment, "id" | "title" | "createdAt" | "updatedAt"> & {
    creator: Pick<User, "id" | "username">;
    // stars: number;
    // replies: number;
  })[];
};

export const loader: LoaderFunction<LoaderData> = async () => {
  const comments = await db.comment.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 20,
    include: {
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
      // replies: {
      //   select: {
      //     id: true,
      //   },
      // }
    },
  });
  return { comments };
};

export const meta: MetaFunction = () => ({
  title: "讨论列表 - HITwh OJ",
});

export function CommentList({
  comments,
}: {
  comments: LoaderData["comments"];
}) {
  type CommentDetails = Pick<
    Comment,
    "id" | "title" | "createdAt" | "updatedAt"
  > & {
    creator: Pick<User, "id" | "username">;
  };
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
      render: (_: any) => (
        <Space size={6}>
          <IconHeart />
          73 <IconMessage />
          42
          <IconExclamationCircle />0
        </Space>
      ),
    },
    {
      title: "Author",
      render: (_: any, comment: CommentDetails) => (
        <Link to={`/user/${comment.creator.id}`}>
          {comment.creator.username}
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
  const { comments } = useLoaderData<LoaderData>();

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
      <CommentList comments={comments} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

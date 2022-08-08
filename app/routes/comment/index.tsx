import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
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
import { redirect } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Like } from "~/src/comment/Like";
import { ReportType } from "@prisma/client";
import { CommentTag } from "~/src/comment/CommentTag";
import { formatDateTime } from "~/utils/tools";
import { findRequestUser } from "~/utils/permission";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import { useContext } from "react";
import { UserContext } from "~/utils/context/user";

enum ActionType {
  None = "none",
  Heart = "heart",
  UnHeart = "unheart",
}

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);

  if (!self.userId) {
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
              id: self.userId,
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
              id: self.userId,
            },
          },
        },
      });
      return null;
    }
  }

  return null;
}

export async function loader(_: LoaderArgs) {
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
      reports: {
        select: {
          creatorId: true,
        },
      },
    },
  });

  return json({ comments });
}

export const meta: MetaFunction = () => ({
  title: "讨论列表 - HITwh OJ",
});

type LoaderData = UseDataFunctionReturn<typeof loader>;

export function CommentList({
  comments,
}: {
  comments: LoaderData["comments"];
}) {
  const likeStyles = {
    fontSize: "1rem",
    height: "1.7rem",
    padding: "0 0.3rem",
  };
  type CommentDetails = typeof comments[number];

  const self = useContext(UserContext);

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
    {
      title: "Stars",
      render: (_: any, comment: CommentDetails) => (
        <Space size={6}>
          <Like
            props={{
              id: comment.id,
              like: comment.heartees.map((u) => u.id).includes(self ?? -1),
              count: comment.heartees.length,
              likeAction: ActionType.Heart,
              dislikeAction: ActionType.UnHeart,
              likeElement: <IconHeartFill style={{ color: "#f53f3f" }} />,
              dislikeElement: <IconHeart />,
              style: likeStyles,
            }}
          />
          <Link to={`/comment/${comment.id}`}>
            <Like
              props={{
                id: comment.id,
                like: comment.replies
                  .map((u) => u.creatorId)
                  .includes(self ?? -1),
                count: comment.replies.length,
                likeAction: ActionType.None,
                dislikeAction: ActionType.None,
                likeElement: <IconMessage style={{ color: "#00B42A" }} />,
                dislikeElement: <IconMessage />,
                style: likeStyles,
              }}
            />
          </Link>
          <Link to={`/comment/report/${ReportType.C + comment.id}`}>
            <Like
              props={{
                id: comment.id,
                like: comment.reports
                  .map((r) => r.creatorId)
                  .includes(self ?? -1),
                count: comment.reports.length,
                likeAction: ActionType.None,
                dislikeAction: ActionType.None,
                likeElement: (
                  <IconExclamationCircleFill style={{ color: "#F53F3F" }} />
                ),
                dislikeElement:
                  comment.reports.length > 0 ? (
                    <IconExclamationCircle style={{ color: "#F53F3F" }} />
                  ) : (
                    <IconExclamationCircle />
                  ),
                style: likeStyles,
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
  const { comments } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>
        <Grid.Row justify="space-between" align="center">
          讨论列表
          {
            /* TODO 完善权限检查 */ true && (
              <Link to="new">
                <Button type="primary" icon={<IconPlus />}>
                  新建讨论
                </Button>
              </Link>
            )
          }
        </Grid.Row>
      </Typography.Title>
      <Typography.Paragraph>
        <CommentList comments={comments} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

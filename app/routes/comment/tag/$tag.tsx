import type { Comment, Reply, User } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { Divider } from "@arco-design/web-react";
import { CommentList } from "~/routes/comment";
import { findSessionUid } from "~/utils/sessions";
import type { CommentTag } from "@prisma/client";

export { action } from "~/routes/comment";

type LoaderData = {
  comments: (Pick<Comment, "id" | "title" | "createdAt" | "updatedAt"> & {
    creator: Pick<User, "id" | "nickname">;
    tags: Pick<CommentTag, "id" | "name">[];
    heartees: Pick<User, "id" | "nickname">[];
    replies: Pick<Reply, "id" | "creatorId">[];
    reportees: Pick<User, "id">[];
  })[];
  self: number;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const tag = invariant(tagScheme, params.tag, {
    status: 404,
  });

  const comments = await db.comment.findMany({
    where: {
      tags: {
        some: {
          name: tag,
        },
      },
    },
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

  if (!comments.length) {
    throw new Response("Comment Tag not found", { status: 404 });
  }

  const self = await findSessionUid(request);
  if (!self) {
    return {
      comments,
      self: -1,
    };
  }
  return { comments, self };
};

export const meta: MetaFunction = ({ params }) => ({
  title: `题单标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { comments, self } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Tag: {tag}</h1>
      <Divider />
      <CommentList comments={comments} self={self} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

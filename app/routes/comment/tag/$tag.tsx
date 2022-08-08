import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { Divider } from "@arco-design/web-react";
import { CommentList } from "~/routes/comment";

export { action } from "~/routes/comment";

export async function loader({ params }: LoaderArgs) {
  const tag = invariant(tagScheme, params.tag, { status: 404 });

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
      reports: {
        select: {
          creatorId: true,
        },
      },
    },
  });

  if (!comments.length) {
    throw new Response("Comment Tag not found", { status: 404 });
  }

  return { comments };
}

export const meta: MetaFunction = ({ params }) => ({
  title: `题单标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { comments } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Tag: {tag}</h1>
      <Divider />
      <CommentList comments={comments} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import { Link, useLoaderData } from "@remix-run/react";
import type { Comment, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { Button } from "@arco-design/web-react";

type LoaderData = {
  comment: Comment & {
    creator: Pick<User, "id" | "nickname">;
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
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
        },
      },
    },
  });
  if (!comment) {
    throw "comment not found";
  }
  return {
    comment,
  };
};

export default function Report() {
  const { comment } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>举办捏 (\香槟\香槟)</h1>
      <h2>
        举办目标: Comment: #{comment.id} - {comment.title}
      </h2>
      <Link to={"/user/" + comment.creator.id}>
        <p>作者: {comment.creator.nickname}</p>
      </Link>
      <form>
        <textarea name="content" rows={10} cols={80}></textarea>
        <br />
        <Button type="default">提交</Button>
      </form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

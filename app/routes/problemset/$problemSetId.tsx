import type { ProblemSet, ProblemSetTag } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Tag, Typography } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import { checkProblemSetReadPermission } from "~/utils/permission/problemset";
import { IconTag } from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";

type LoaderData = {
  problemSet: Pick<ProblemSet, "title" | "description"> & {
    tags: Pick<ProblemSetTag, "name">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  await checkProblemSetReadPermission(request, problemSetId);

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      title: true,
      description: true,
      tags: { select: { name: true } },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return {
    problemSet,
  };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function Problemset() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>{problemSet.title}</Typography.Title>

      {problemSet.tags.length > 0 && (
        <Typography.Paragraph>
          <TagSpace>
            {problemSet.tags.map(({ name }) => (
              <Link to={`/problemset/tag/${name}`} key={name}>
                <Tag icon={<IconTag />}>{name}</Tag>
              </Link>
            ))}
          </TagSpace>
        </Typography.Paragraph>
      )}

      <Typography.Paragraph>
        <Navigator
          routes={[
            { title: "详情", key: "." },
            { title: "编辑", key: "edit" },
          ]}
        />
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

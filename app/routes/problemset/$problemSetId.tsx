import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Tag, Typography } from "@arco-design/web-react";
import { Navigator } from "~/src/Navigator";
import { IconEyeInvisible, IconTag } from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import {
  findProblemSetPrivacy,
  findProblemSetTeam,
} from "~/utils/db/problemset";

export async function loader({ request, params }: LoaderArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self
    .team(await findProblemSetTeam(problemSetId))
    .checkPermission(
      (await findProblemSetPrivacy(problemSetId))
        ? Permissions.PERM_VIEW_PROBLEM_SET
        : Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
    );

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      title: true,
      description: true,
      private: true,
      tags: { select: { name: true } },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `题单: ${data?.problemSet.title} - HITwh OJ`,
  description: data?.problemSet.description,
});

export default function Problemset() {
  const { problemSet } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={3}>{problemSet.title}</Typography.Title>

      {(problemSet.tags.length > 0 || problemSet.private) && (
        <Typography.Paragraph>
          <TagSpace>
            {problemSet.private && (
              <Tag icon={<IconEyeInvisible />} color="gold">
                隐藏
              </Tag>
            )}
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

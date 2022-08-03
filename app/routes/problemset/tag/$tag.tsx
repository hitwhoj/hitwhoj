import type { ProblemSet } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { tagScheme } from "~/utils/scheme";
import { Typography } from "@arco-design/web-react";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { TableList } from "~/src/TableList";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";

type LoaderData = {
  problemSets: (Pick<ProblemSet, "id" | "title" | "private"> & {
    _count: {
      problems: number;
    };
  })[];
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const tag = invariant(tagScheme, params.tag, { status: 404 });
  const self = await findRequestUser(request);
  const [viewAll, viewPublic] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC
    );

  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { team: null, tags: { some: { name: tag } } }
      : viewPublic
      ? { team: null, tags: { some: { name: tag } }, private: false }
      : { id: -1 },
    orderBy: { id: "asc" },
    select: {
      id: true,
      title: true,
      private: true,
      _count: {
        select: {
          problems: true,
        },
      },
    },
  });

  if (!problemSets.length) {
    throw new Response("Problem Set Tag not found", { status: 404 });
  }

  return { problemSets };
};

export const meta: MetaFunction = ({ params }) => ({
  title: `题单标签: ${params.tag} - HITwh OJ`,
});

export default function ProblemSetTag() {
  const { tag } = useParams();
  const { problemSets } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>题单标签：{tag}</Typography.Title>

      <Typography.Paragraph>
        <TableList
          data={problemSets}
          columns={[
            {
              title: "#",
              render: ({ id }) => id,
              minimize: true,
            },
            {
              title: "题单",
              render: (problemset) => (
                <ProblemSetLink problemset={problemset} />
              ),
            },
            {
              title: "题目数",
              render: ({ _count: { problems } }) => problems,
              align: "center",
              minimize: true,
            },
          ]}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

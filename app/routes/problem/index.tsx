import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { selectProblemListData } from "~/utils/db/problem";
import { db } from "~/utils/server/db.server";
import { ProblemLink } from "~/src/problem/ProblemLink";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { HiOutlinePlus } from "react-icons/hi";
import { pageScheme } from "~/utils/scheme";
import { invariant } from "~/utils/invariant";
import { Pagination } from "~/src/Pagination";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { TagSelector } from "~/src/TagSelector";

const PAGE_SIZE = 15;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewAll, viewPublic, hasCreatePerm] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM,
      Permissions.PERM_VIEW_PROBLEM_PUBLIC,
      Permissions.PERM_CREATE_PROBLEM
    );

  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const tags = url.searchParams.get("tags")?.split(",") || [];
  const tagQuery = tags.map((tagName) => { return { tags: { some: { name: tagName } } } });
  const totalProblems = await db.problem.count({
    where: viewAll
      ? { team: null, AND: tagQuery }
      : viewPublic
      ? { team: null, private: false, AND: tagQuery }
      : { id: -1, AND: tagQuery },
  });
  if (totalProblems && page > Math.ceil(totalProblems / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const problems = await db.problem.findMany({
    where: viewAll
      ? { team: null, AND: tagQuery }
      : viewPublic
      ? { team: null, private: false, AND: tagQuery }
      : { id: -1, AND: tagQuery },
    orderBy: [{ id: "asc" }],
    select: {
      ...selectProblemListData,
      _count: {
        select: {
          relatedRecords: true,
        },
      },
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const allTags = await db.problemTag.findMany({
    select: {
      name: true
    }
  });

  return json({ tagsUrl: url.searchParams.get("tags"), problems, allTags, tags, hasCreatePerm, totalProblems, currentPage: page });
}

export const meta: MetaFunction = () => ({
  title: "题目列表 - HITwh OJ",
});

export default function ProblemIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const tagsUrl = useComputed(() => loaderData.value.tagsUrl);
  const problems = useComputed(() => loaderData.value.problems);
  const allTags = useComputed(() => loaderData.value.allTags);
  const tags = useComputed(() => loaderData.value.tags);
  const hasCreatePerm = useComputed(() => loaderData.value.hasCreatePerm);
  const totalProblems = useComputed(() => loaderData.value.totalProblems);
  const currentPage = useComputed(() => loaderData.value.currentPage);

  const totalPages = useComputed(() =>
    Math.ceil(totalProblems.value / PAGE_SIZE)
  );

  return (
    <>
      <h1 className="flex items-center justify-between">
        <span>题目列表</span>
        {hasCreatePerm.value && (
          <Link to="/problem/new" className="btn btn-primary gap-2">
            <HiOutlinePlus className="h-4 w-4" />
            <span>新建题目</span>
          </Link>
        )}
      </h1>

      <TagSelector
        allTags={allTags.value.map(({name}) => name)}
        selectedTags={tags.value}
        action="/problem" 
      />

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>题目</th>
            <th>提交</th>
          </tr>
        </thead>
        <tbody>
          {problems.value.map((problem) => (
            <tr key={problem.id}>
              <th className="text-center">{problem.id}</th>
              <td>
                <ProblemLink problem={problem} />
              </td>
              <td>{problem._count.relatedRecords}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        action={"/problem" + (tagsUrl.value != null ? "?tags=" + tagsUrl.value : "")}
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { ProblemSetLink } from "~/src/problemset/ProblemSetLink";
import { Permissions } from "~/utils/permission/permission";
import {HiOutlinePlus, HiOutlineTag} from "react-icons/hi";
import { findRequestUser } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { pageScheme } from "~/utils/scheme";
import { Pagination } from "~/src/Pagination";
import { useSignalLoaderData } from "~/utils/hooks";
import {useComputed, useSignal} from "@preact/signals-react";
import { TagSelector } from "~/src/TagSelector";

const PAGE_SIZE = 15;

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  const [viewAll, viewPublic, hasEditPerm] = await self
    .team(null)
    .hasPermission(
      Permissions.PERM_VIEW_PROBLEM_SET,
      Permissions.PERM_VIEW_PROBLEM_SET_PUBLIC,
      Permissions.PERM_EDIT_PROBLEM_SET
    );

  const url = new URL(request.url);
  const page = invariant(pageScheme, url.searchParams.get("page") || "1");
  const tags = url.searchParams.get("tags")?.split(",") || [];
  const tagQuery = tags.map((tagName) => { return { tags: { some: { name: tagName } } } });
  const totalProblemSets = await db.problemSet.count({
    where: viewAll
      ? { team: null, AND: tagQuery }
      : viewPublic
      ? { team: null, private: false, AND: tagQuery }
      : { id: -1, AND: tagQuery },
  });
  if (totalProblemSets && page > Math.ceil(totalProblemSets / PAGE_SIZE)) {
    throw new Response("Page is out of range", { status: 404 });
  }

  const problemSets = await db.problemSet.findMany({
    where: viewAll
      ? { team: null, AND: tagQuery }
      : viewPublic
      ? { team: null, private: false, AND: tagQuery }
      : { id: -1, AND: tagQuery },

    orderBy: [{ id: "asc" }],
    select: {
      id: true,
      title: true,
      private: true,
      tags: true,
      _count: {
        select: {
          problems: true,
        },
      },
    },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const allTags = await db.problemSetTag.findMany({
    select: {
      name: true
    }
  });

  return json({
    tagsUrl: url.searchParams.get("tags"),
    allTags,
    tags,
    problemSets,
    hasEditPerm,
    totalProblemSets,
    currentPage: page,
  });
}

export const meta: MetaFunction = () => ({
  title: "题单列表 - HITwh OJ",
});

export default function ProblemsetList() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const tagsUrl = useComputed(() => loaderData.value.tagsUrl);
  const allTags = useComputed(() => loaderData.value.allTags);
  const tags = useComputed(() => loaderData.value.tags);
  const showTags = useSignal(true);
  const problemSets = useComputed(() => loaderData.value.problemSets);
  const hasEditPerm = useComputed(() => loaderData.value.hasEditPerm);
  const totalProblemSets = useComputed(() => loaderData.value.totalProblemSets);
  const currentPage = useComputed(() => loaderData.value.currentPage);
  const totalPages = useComputed(() =>
    Math.ceil(totalProblemSets.value / PAGE_SIZE)
  );

  return (
    <>
      <h1 className="flex items-center justify-between">
        <span>题单列表</span>

        {hasEditPerm.value && (
          <Link className="btn btn-primary gap-2" to="new">
            <HiOutlinePlus className="h-4 w-4" />
            <span>新建题单</span>
          </Link>
        )}
      </h1>

      <div className="flex">
        <label className="flex items-center px-4 py-2 text-sm">
          <input
            type="checkbox"
            className="checkbox mr-2 leading-tight"
            checked={showTags.value}
            onChange={(event) => (showTags.value = event.target.checked)}
          />
          显示标签
        </label>
        <TagSelector
          allTags={allTags.value.map(({ name }) => name)}
          selectedTags={tags.value}
          key={tagsUrl.value}
          action="/problemset"
        />
      </div>

      <table className="not-prose table-compact table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>题单</th>
            <th className="w-24">题目数量</th>
          </tr>
        </thead>
        <tbody>
          {problemSets.value.map((problemset, index) => (
            <tr key={problemset.id}>
              <th className="text-center">
                {index + 1 + (Number(currentPage) - 1) * PAGE_SIZE}
              </th>
              <td className="not-prose flex flex-wrap gap-4">
                <ProblemSetLink problemset={problemset} />
                <span className="flex gap-2">
                  {showTags.value &&
                    problemset.tags.map((tag) => (
                      <Link
                        className="badge gap-1"
                        to={`/problemset?tags=${tag.name}`}
                        key={tag.name}
                      >
                        <HiOutlineTag />
                        <span>{tag.name}</span>
                      </Link>
                    ))}
                </span>
              </td>
              <td>{problemset._count.problems}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        action={
          "/problemset" +
          (tagsUrl.value != null ? "?tags=" + tagsUrl.value : "")
        }
        totalPages={totalPages.value}
        currentPage={currentPage.value}
      />
    </>
  );
}

export {ErrorBoundary} from "~/src/ErrorBoundary";
export {CatchBoundary} from "~/src/CatchBoundary";

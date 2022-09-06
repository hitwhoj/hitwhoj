import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import { useContext, useEffect, useState } from "react";
import { selectProblemListData } from "~/utils/db/problem";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findProblemSetTeam } from "~/utils/db/problemset";
import { HiOutlineTag, HiOutlineX } from "react-icons/hi";
import { ProblemEditor } from "~/src/problem/ProblemEditor";
import { ToastContext } from "~/utils/context/toast";

export async function loader({ request, params }: LoaderArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemSetTeam(problemSetId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM_SET);

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    select: {
      id: true,
      title: true,
      description: true,
      private: true,
      tags: true,
      problems: {
        orderBy: { rank: "asc" },
        select: {
          problem: {
            select: {
              ...selectProblemListData,
            },
          },
        },
      },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet });
}

enum ActionType {
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  MoveProblemUp = "moveProblemUp",
  MoveProblemDown = "moveProblemDown",
  UpdateInformation = "updateInformation",
}

export async function action({ request, params }: ActionArgs) {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self
    .team(await findProblemSetTeam(problemSetId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM_SET);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const {
          _max: { rank },
        } = await db.problemSetProblem.aggregate({
          where: { problemSetId },
          _max: { rank: true },
        });

        await db.problemSetProblem.create({
          data: {
            problemSetId,
            problemId,
            rank: (rank ?? 0) + 1,
          },
        });
      });

      return null;
    }

    case ActionType.DeleteProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async () => {
        const { rank } = await db.problemSetProblem.delete({
          where: {
            problemSetId_problemId: {
              problemSetId,
              problemId,
            },
          },
        });

        await db.problemSetProblem.updateMany({
          where: { rank: { gte: rank } },
          data: { rank: { decrement: 1 } },
        });
      });

      return null;
    }

    case ActionType.MoveProblemUp:
    case ActionType.MoveProblemDown: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const problem = await db.problemSetProblem.findUnique({
          where: {
            problemSetId_problemId: {
              problemSetId,
              problemId,
            },
          },
        });

        if (!problem) {
          throw new Response("题目不存在", { status: 404 });
        }

        const { rank } = problem;

        const target = await db.problemSetProblem.findUnique({
          where: {
            problemSetId_rank: {
              problemSetId,
              rank: _action === ActionType.MoveProblemUp ? rank - 1 : rank + 1,
            },
          },
        });

        if (!target) {
          throw new Response("移动失败", { status: 400 });
        }

        // 删除原来的位置
        await db.problemSetProblem.delete({
          where: {
            problemSetId_problemId: {
              problemSetId,
              problemId,
            },
          },
        });
        await db.problemSetProblem.delete({
          where: {
            problemSetId_problemId: {
              problemSetId,
              problemId: target.problemId,
            },
          },
        });

        // 插入新的位置
        await db.problemSetProblem.createMany({
          data: [
            {
              problemSetId,
              problemId: target.problemId,
              rank,
            },
            {
              problemSetId,
              problemId,
              rank: rank + (_action === ActionType.MoveProblemUp ? -1 : 1),
            },
          ],
        });
      });

      return null;
    }

    case ActionType.UpdateInformation: {
      const title = invariant(titleScheme, form.get("title"));
      const description = invariant(descriptionScheme, form.get("description"));
      const priv = form.has("private");
      const tags = form.getAll("tag").map((tag) => invariant(tagScheme, tag));

      await db.$transaction(async (db) => {
        const problemset = await db.problemSet.update({
          where: { id: problemSetId },
          data: {
            title,
            description,
            private: priv,
          },
          select: { tags: { select: { name: true } } },
        });

        await db.problemSet.update({
          where: { id: problemSetId },
          data: {
            tags: {
              connectOrCreate: tags
                .filter((tag) => !problemset.tags.some((t) => t.name === tag))
                .map((tag) => ({
                  where: { name: tag },
                  create: { name: tag },
                })),
              disconnect: problemset.tags
                .filter((tag) => !tags.includes(tag.name))
                .map((tag) => ({ name: tag.name })),
            },
          },
        });
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑题单: ${data?.problemSet.title} - HITwh OJ`,
});

export default function ProblemSetEdit() {
  const { problemSet } = useLoaderData<typeof loader>();
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionRedirect = state === "loading" && type === "actionRedirect";
  const isUpdating = isActionSubmit || isActionRedirect;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionRedirect) {
      Toasts.success("更新成功");
    }
  }, [isActionRedirect]);

  const [tags, setTags] = useState(problemSet.tags.map(({ name }) => name));
  const [tag, setTag] = useState("");

  const handleRemoveTag = (name: string) =>
    setTags(tags.filter((tag) => tag !== name));

  return (
    <>
      <h2>编辑题目信息</h2>
      <Form method="post" className="form-control">
        <label className="label">
          <span className="label-text">标题</span>
        </label>
        <input
          className="input input-bordered w-full max-w-xs"
          type="text"
          name="title"
          defaultValue={problemSet.title}
          disabled={isUpdating}
          required
        />

        <label className="label">
          <span className="label-text">题单标签</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((name) => (
            <div className="badge inline-flex gap-1" key={name}>
              <input type="hidden" name="tag" value={name} />
              <HiOutlineTag />
              {name}
              <HiOutlineX
                className="cursor-pointer"
                onClick={() => handleRemoveTag(name)}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <input
            type="text"
            className="input input-bordered"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              tag && setTags((tags) => [...tags, tag]);
              setTag("");
            }}
          >
            添加标签
          </button>
        </div>

        <label className="label">
          <span className="label-text">简介</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          name="description"
          defaultValue={problemSet.description}
          disabled={isUpdating}
          required
        />

        <label className="label cursor-pointer justify-start gap-2 mt-4">
          <input
            className="checkbox checkbox-primary"
            type="checkbox"
            name="private"
            defaultChecked={problemSet.private}
            disabled={isUpdating}
          />
          <span className="label-text">保持题单隐藏</span>
        </label>

        <button
          className="btn btn-primary mt-4 w-full max-w-xs"
          type="submit"
          name="_action"
          value={ActionType.UpdateInformation}
          disabled={isUpdating}
        >
          确认修改
        </button>
      </Form>

      <h2>题目</h2>
      <ProblemEditor
        problems={problemSet.problems.map(({ problem }) => problem)}
        createAction={ActionType.CreateProblem}
        deleteAction={ActionType.DeleteProblem}
        moveUpAction={ActionType.MoveProblemUp}
        moveDownAction={ActionType.MoveProblemDown}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

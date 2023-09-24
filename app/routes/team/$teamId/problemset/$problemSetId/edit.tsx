import { useComputed } from "@preact/signals-react";
import {
  type ActionArgs,
  json,
  type LoaderArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect } from "react";
import { MarkdownEditor } from "~/src/MarkdownEditor";
import { TagsEditor } from "~/src/form/TagsEditor";
import { selectProblemListData } from "~/utils/db/problem";
import { useSignalLoaderData, useSignalTransition } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import {
  descriptionScheme,
  idScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { useToasts } from "~/utils/toast";
import { TeamProblemEditor } from "~/src/problem/TeamProblemEditor";
// import Problemset from "../$problemSetId";
export async function loader({ request, params }: LoaderArgs) {
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });
  const problemSetId = await invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.team(teamId).checkPermission(Permissions.PERM_EDIT_PROBLEM_SET);
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
  return json({ problemSet, teamId });
}

enum ActionType {
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  MoveProblemUp = "moveProblemUp",
  MoveProblemDown = "moveProblemDown",
  UpdateInformation = "updateInformation",
}

export async function action({ request, params }: ActionArgs) {
  const problemSetId = await invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  const teamId = await invariant(idScheme, params.teamId, { status: 404 });
  const self = await findRequestUser(request);
  await self.team(teamId).checkPermission(Permissions.PERM_EDIT_PROBLEM_SET);
  const form = await request.formData();
  const _action = form.get("_action");
  switch (_action) {
    case ActionType.CreateProblem: {
      const problemId = await invariant(idScheme, form.get("pid"));
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
  const loaderData = useSignalLoaderData<typeof loader>();
  const problemSet = useComputed(() => loaderData.value.problemSet);

  const transition = useSignalTransition();

  const Toasts = useToasts();

  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("更新成功");
    }
  }, [transition.actionSuccess]);

  return (
    <>
      <h3>编辑团队题单信息</h3>

      <Form method="post" className="form-control gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">标题</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            name="title"
            defaultValue={problemSet.value.title}
            disabled={transition.isRunning}
            required
          />
        </div>

        <TagsEditor
          label="题单标签"
          name="tag"
          defaultTags={problemSet.value.tags.map(({ name }) => name)}
        />

        <div className="form-control">
          <label className="label">
            <span className="label-text">简介</span>
          </label>
          <MarkdownEditor
            name="description"
            defaultValue={problemSet.value.description}
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              className="checkbox checkbox-primary"
              type="checkbox"
              name="private"
              defaultChecked={problemSet.value.private}
              disabled={transition.isRunning}
            />
            <span className="label-text">保持题单隐藏</span>
          </label>
        </div>

        <div className="form-control w-full max-w-xs">
          <button
            className="btn btn-primary"
            type="submit"
            name="_action"
            value={ActionType.UpdateInformation}
            disabled={transition.isRunning}
          >
            确认修改
          </button>
        </div>
      </Form>

      <h3>题目</h3>

      <TeamProblemEditor
        teamId={loaderData.value.teamId}
        problems={problemSet.value.problems.map(({ problem }) => problem)}
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

import type { ProblemSet, ProblemSetTag } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import {
  Form as ArcoForm,
  Input,
  Button,
  Typography,
  Checkbox,
  Message,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import type { ProblemListData } from "~/utils/db/problem";
import { selectProblemListData } from "~/utils/db/problem";
import { TagEditor } from "~/src/TagEditor";
import { ProblemEditor } from "~/src/ProblemEditor";
import { permissionProblemSetUpdate } from "~/utils/permission/problemset";
import { assertPermission } from "~/utils/permission";
const FormItem = ArcoForm.Item;
const TextArea = Input.TextArea;

type LoaderData = {
  problemSet: Pick<ProblemSet, "id" | "title" | "description" | "private"> & {
    tags: ProblemSetTag[];
    problems: {
      problem: ProblemListData;
    }[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  await assertPermission(permissionProblemSetUpdate, request, problemSetId);

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

  return { problemSet };
};

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  UpdateInformation = "updateInformation",
  MoveProblemUp = "moveProblemUp",
  MoveProblemDown = "moveProblemDown",
}

export const action: ActionFunction = async ({ request, params }) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  await assertPermission(permissionProblemSetUpdate, request, problemSetId);

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

    case ActionType.CreateTag: {
      const tag = invariant(tagScheme, form.get("tag"));

      await db.problemSet.update({
        where: { id: problemSetId },
        data: {
          tags: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteTag: {
      const tag = invariant(tagScheme, form.get("tag"));

      await db.problemSet.update({
        where: { id: problemSetId },
        data: {
          tags: {
            disconnect: {
              name: tag,
            },
          },
        },
      });

      return null;
    }

    case ActionType.UpdateInformation: {
      const title = invariant(titleScheme, form.get("title"));
      const description = invariant(descriptionScheme, form.get("description"));
      const priv = form.get("private") === "true";

      await db.problemSet.update({
        where: { id: problemSetId },
        data: {
          title,
          description,
          private: priv,
        },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `编辑题单: ${data?.problemSet.title} - HITwh OJ`,
});

export default function ProblemSetEdit() {
  const { problemSet } = useLoaderData<LoaderData>();

  const [priv, setPriv] = useState(problemSet.private);

  const { state, type } = useTransition();
  const isActionReload = state === "loading" && type === "actionReload";
  const isUpdating = state === "submitting" || isActionReload;
  useEffect(() => {
    if (isActionReload) {
      Message.success("更新成功");
    }
  }, [isActionReload]);

  return (
    <Typography>
      <Typography.Title heading={4}>编辑题单</Typography.Title>
      <Typography.Paragraph>
        <Form method="post">
          <FormItem label="标签" layout="vertical">
            <TagEditor
              tags={problemSet.tags.map(({ name }) => name)}
              createAction={ActionType.CreateTag}
              deleteAction={ActionType.DeleteTag}
            />
          </FormItem>

          <FormItem label="标题" layout="vertical" required>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={problemSet.title}
              disabled={isUpdating}
              required
            />
          </FormItem>

          <FormItem label="描述" layout="vertical">
            <TextArea
              id="description"
              name="description"
              defaultValue={problemSet.description}
              disabled={isUpdating}
              autoSize={{ minRows: 3, maxRows: 10 }}
            />
          </FormItem>

          <FormItem>
            <input type="hidden" name="private" value={String(priv)} />
            <Checkbox
              checked={priv}
              onChange={(checked) => setPriv(checked)}
              disabled={isUpdating}
            >
              首页隐藏
            </Checkbox>
          </FormItem>

          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              name="_action"
              value={ActionType.UpdateInformation}
            >
              确认修改
            </Button>
          </FormItem>
        </Form>
      </Typography.Paragraph>

      <Typography.Title heading={4}>题目</Typography.Title>
      <Typography.Paragraph>
        <ProblemEditor
          problems={problemSet.problems.map(({ problem }) => problem)}
          createAction={ActionType.CreateProblem}
          deleteAction={ActionType.DeleteProblem}
          moveUpAction={ActionType.MoveProblemUp}
          moveDownAction={ActionType.MoveProblemDown}
        />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

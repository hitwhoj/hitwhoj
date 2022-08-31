import {
  Typography,
  Form as ArcoForm,
  Input,
  Button,
  Checkbox,
  Message,
} from "@arco-design/web-react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import { TagEditor } from "~/src/TagEditor";
import { findProblemTeam } from "~/utils/db/problem";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import {
  descriptionScheme,
  idScheme,
  limitScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

const FormItem = ArcoForm.Item;

export async function loader({ request, params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimit: true,
      memoryLimit: true,
      private: true,
      allowSubmit: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("题目未找到", { status: 404 });
  }

  return json({ problem });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑题目: ${data?.problem.title} - HITwh OJ`,
});

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  UpdateInformation = "updateInformation",
}

export async function action({ request, params }: ActionArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UpdateInformation: {
      const title = invariant(titleScheme, form.get("title"));
      const description = invariant(descriptionScheme, form.get("description"));
      const timeLimit = invariant(limitScheme, form.get("timeLimit"));
      const memoryLimit = invariant(limitScheme, form.get("memoryLimit"));
      const priv = form.get("private") === "true";
      const submit = form.get("allowSubmit") === "true";

      await db.problem.update({
        where: { id: problemId },
        data: {
          title,
          description,
          timeLimit,
          memoryLimit,
          private: priv,
          allowSubmit: submit,
        },
      });

      return null;
    }

    case ActionType.CreateTag: {
      const name = invariant(tagScheme, form.get("tag"));

      await db.problem.update({
        where: { id: problemId },
        data: {
          tags: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteTag: {
      const name = invariant(tagScheme, form.get("tag"));

      await db.problem.update({
        where: { id: problemId },
        data: { tags: { disconnect: { name } } },
      });

      return null;
    }
  }

  throw new Response("无效的操作", { status: 400 });
}

export default function ProblemEdit() {
  const { problem } = useLoaderData<typeof loader>();

  const [pub, setPub] = useState(!problem.private);
  const [submit, setSubmit] = useState(problem.allowSubmit);

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
      <Typography.Title heading={4}>编辑题目信息</Typography.Title>

      <Typography.Paragraph>
        <FormItem layout="vertical" label="题目标签">
          <TagEditor
            tags={problem.tags.map(({ name }) => name)}
            createAction={ActionType.CreateTag}
            deleteAction={ActionType.DeleteTag}
          />
        </FormItem>
        <Form method="post">
          <FormItem layout="vertical" label="题目名称" required>
            <Input
              name="title"
              required
              defaultValue={problem.title}
              disabled={isUpdating}
            />
          </FormItem>
          <FormItem layout="vertical" label="题目正文" required>
            <Input.TextArea
              name="description"
              required
              defaultValue={problem.description}
              disabled={isUpdating}
              autoSize
            />
          </FormItem>
          <FormItem
            layout="vertical"
            label="时间限制 (ms, 仅供题面参考)"
            required
          >
            <Input
              name="timeLimit"
              type="number"
              required
              defaultValue={String(problem.timeLimit)}
              disabled={isUpdating}
            />
          </FormItem>
          <FormItem
            layout="vertical"
            label="内存限制 (byte, 仅供题面参考)"
            required
          >
            <Input
              name="memoryLimit"
              type="number"
              required
              defaultValue={String(problem.memoryLimit)}
              disabled={isUpdating}
            />
          </FormItem>
          <FormItem>
            <input type="hidden" name="private" value={String(!pub)} />
            <Checkbox
              checked={pub}
              onChange={(checked) => setPub(checked)}
              disabled={isUpdating}
            >
              公开题目
            </Checkbox>
          </FormItem>
          <FormItem>
            <input type="hidden" name="allowSubmit" value={String(submit)} />
            <Checkbox
              checked={submit}
              onChange={(checked) => setSubmit(checked)}
              disabled={isUpdating}
            >
              允许提交
            </Checkbox>
          </FormItem>
          <FormItem layout="vertical">
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
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import {
  Typography,
  Form as ArcoForm,
  Input,
  Button,
  Checkbox,
  Message,
} from "@arco-design/web-react";
import type { Problem } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";
import { invariant } from "~/utils/invariant";
import { checkProblemWritePermission } from "~/utils/permission/problem";
import {
  descriptionScheme,
  idScheme,
  limitScheme,
  titleScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

const FormItem = ArcoForm.Item;

type LoaderData = {
  problem: Pick<
    Problem,
    "id" | "title" | "description" | "timeLimit" | "memoryLimit" | "private"
  >;
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  await checkProblemWritePermission(request, problemId);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimit: true,
      memoryLimit: true,
      private: true,
    },
  });

  if (!problem) {
    throw new Response("题目未找到", { status: 404 });
  }

  return { problem };
};

export const action: ActionFunction = async ({ request, params }) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  await checkProblemWritePermission(request, problemId);

  const form = await request.formData();

  const title = invariant(titleScheme, form.get("title"));
  const description = invariant(descriptionScheme, form.get("description"));
  const timeLimit = invariant(limitScheme, form.get("timeLimit"));
  const memoryLimit = invariant(limitScheme, form.get("memoryLimit"));
  const priv = form.get("private") === "true";

  await db.problem.update({
    where: { id: problemId },
    data: { title, description, timeLimit, memoryLimit, private: priv },
  });

  return null;
};

export default function ProblemEdit() {
  const { problem } = useLoaderData<LoaderData>();

  const [hide, setHide] = useState(problem.private);

  const { state } = useTransition();
  const isUpdating = state !== "idle";
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (!first && !isUpdating) {
      Message.success("更新成功");
    }
    if (first) setFirst(false);
  }, [isUpdating]);

  return (
    <Typography>
      <Typography.Title heading={4}>编辑题目信息</Typography.Title>

      <Typography.Paragraph>
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
            <input type="hidden" name="private" value={String(hide)} />
            <Checkbox
              checked={hide}
              onChange={(checked) => setHide(checked)}
              disabled={isUpdating}
            >
              首页隐藏
            </Checkbox>
          </FormItem>
          <FormItem layout="vertical">
            <Button type="primary" htmlType="submit" loading={isUpdating}>
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

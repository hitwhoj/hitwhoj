import {
  Typography,
  Form as ArcoForm,
  Input,
  Button,
  Checkbox,
  Message,
  Tag,
} from "@arco-design/web-react";
import { IconLoading, IconPlus, IconTag } from "@arco-design/web-react/icon";
import type { Problem, ProblemTag } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Response } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { TagSpace } from "~/src/TagSpace";
import { invariant } from "~/utils/invariant";
import { checkProblemWritePermission } from "~/utils/permission/problem";
import {
  descriptionScheme,
  idScheme,
  limitScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

const FormItem = ArcoForm.Item;

type LoaderData = {
  problem: Pick<
    Problem,
    "id" | "title" | "description" | "timeLimit" | "memoryLimit" | "private"
  > & {
    tags: Pick<ProblemTag, "name">[];
  };
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

  return { problem };
};

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  UpdateInformation = "updateInformation",
}

export const action: ActionFunction = async ({ request, params }) => {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  await checkProblemWritePermission(request, problemId);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UpdateInformation: {
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
};

function ProblemTagItem({ name }: { name: string }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Tag
      visible={true}
      closable
      onClose={() => fetcher.submit(formRef.current)}
      icon={isUpdating ? <IconLoading /> : <IconTag />}
    >
      {name}
      <fetcher.Form
        method="post"
        style={{
          display: "inline",
          marginRight: 10,
        }}
        ref={formRef}
        hidden
      >
        <input type="hidden" name="tag" value={name} />
        <input type="hidden" name="_action" value={ActionType.DeleteTag} />
      </fetcher.Form>
    </Tag>
  );
}

function ProblemTagCreator() {
  const [showInput, setShowInput] = useState(false);
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.type === "done" && !isCreating) {
      setShowInput(false);
    }
  }, [isCreating]);

  return (
    <fetcher.Form method="post" ref={formRef}>
      <input type="hidden" name="_action" value={ActionType.CreateTag} />
      {showInput ? (
        <Input
          type="text"
          size="mini"
          name="tag"
          style={{ width: "82px" }}
          autoFocus
          onBlur={(e) =>
            e.target.value
              ? fetcher.submit(formRef.current)
              : setShowInput(false)
          }
          disabled={isCreating}
          required
        />
      ) : (
        <Tag
          icon={<IconPlus />}
          style={{
            cursor: "pointer",
            width: "82px",
            textAlign: "center",
          }}
          onClick={() => setShowInput(true)}
        >
          添加标签
        </Tag>
      )}
    </fetcher.Form>
  );
}

function ProblemTagEditor({ tags }: { tags: string[] }) {
  return (
    <TagSpace>
      {tags.map((name) => (
        <ProblemTagItem name={name} key={name} />
      ))}
      <ProblemTagCreator />
    </TagSpace>
  );
}

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
        <FormItem layout="vertical" label="题目标签">
          <ProblemTagEditor tags={problem.tags.map(({ name }) => name)} />
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

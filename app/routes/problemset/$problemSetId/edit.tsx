import type { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import {
  Form,
  Input,
  Button,
  Tag,
  Space,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconLoading,
  IconPlus,
  IconTag,
} from "@arco-design/web-react/icon";
import { useEffect, useRef, useState } from "react";
import { checkProblemSetWritePermission } from "~/utils/permission/problemset";
import { ProblemList } from "~/src/problem/ProblemList";
import type { ProblemListData } from "~/utils/db/problem";
import { selectProblemListData } from "~/utils/db/problem";
import { TagSpace } from "~/src/TagSpace";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: ProblemListData[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  await checkProblemSetWritePermission(request, problemSetId);

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    include: {
      tags: true,
      problems: { select: selectProblemListData },
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
}

export const action: ActionFunction = async ({ request, params }) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
  await checkProblemSetWritePermission(request, problemSetId);

  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.problemSet.update({
        where: { id: problemSetId },
        data: {
          problems: {
            connect: {
              id: problemId,
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.problemSet.update({
        where: { id: problemSetId },
        data: {
          problems: {
            disconnect: {
              id: problemId,
            },
          },
        },
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

      await db.problemSet.update({
        where: { id: problemSetId },
        data: {
          title,
          description,
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

function ProblemSetEditor({
  title,
  description,
  tags,
}: {
  title: string;
  description: string;
  tags: string[];
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="标签" layout="vertical">
        <ProblemSetTagEditor tags={tags} />
      </FormItem>

      <FormItem label="标题" layout="vertical" required>
        <Input
          id="title"
          name="title"
          type="text"
          defaultValue={title}
          disabled={isUpdating}
          required
        />
      </FormItem>

      <FormItem label="描述" layout="vertical">
        <TextArea
          id="description"
          name="description"
          defaultValue={description}
          disabled={isUpdating}
          autoSize={{ minRows: 3, maxRows: 10 }}
        />
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
    </fetcher.Form>
  );
}

function ProblemSetTagItem({ name }: { name: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Tag
      visible={true}
      closable
      onClose={() => fetcher.submit(formRef.current)}
      icon={isDeleting ? <IconLoading /> : <IconTag />}
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

function ProblemSetTagCreator() {
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

function ProblemSetTagEditor({ tags }: { tags: string[] }) {
  return (
    <TagSpace>
      {tags.map((name) => (
        <ProblemSetTagItem name={name} key={name} />
      ))}
      <ProblemSetTagCreator />
    </TagSpace>
  );
}

function ProblemSetProblemOperations({ pid }: { pid: number }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="pid" value={pid} />
      <Button
        type="primary"
        status="danger"
        size="mini"
        htmlType="submit"
        name="_action"
        value={ActionType.DeleteProblem}
        loading={isDeleting}
        icon={<IconDelete />}
      />
    </fetcher.Form>
  );
}

function ProblemSetProblemCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <Space direction="horizontal" size="medium">
        <Input
          id="pid"
          name="pid"
          type="text"
          disabled={isCreating}
          required
          placeholder="输入题目pid"
        />
        <Button
          type="primary"
          htmlType="submit"
          name="_action"
          value={ActionType.CreateProblem}
          loading={isCreating}
        >
          添加捏
        </Button>
      </Space>
    </fetcher.Form>
  );
}

function ProblemEditor({ problems }: { problems: ProblemListData[] }) {
  return (
    <>
      <Typography.Paragraph>
        <ProblemList
          problems={problems}
          columns={[
            {
              title: "操作",
              render: (_: any, problem: Pick<Problem, "id" | "title">) => (
                <ProblemSetProblemOperations pid={problem.id} />
              ),
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
        />
      </Typography.Paragraph>

      <Typography.Paragraph>
        <ProblemSetProblemCreator />
      </Typography.Paragraph>
    </>
  );
}

export default function ProblemSetEdit() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>编辑题单</Typography.Title>
      <Typography.Paragraph>
        <ProblemSetEditor
          title={problemSet.title}
          description={problemSet.description}
          tags={problemSet.tags.map(({ name }) => name)}
        />
      </Typography.Paragraph>

      <Typography.Title heading={4}>题目</Typography.Title>
      <Typography.Paragraph>
        <ProblemEditor problems={problemSet.problems} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

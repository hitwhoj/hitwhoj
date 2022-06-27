import type { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import { Form, Input, Button, Tag, Table, Space } from "@arco-design/web-react";
import { IconDelete, IconLoading } from "@arco-design/web-react/icon";
import { useRef } from "react";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: Pick<Problem, "id" | "title">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });

  const problemSet = await db.problemSet.findUnique({
    where: { id: problemSetId },
    include: {
      tags: true,
      problems: {
        select: {
          id: true,
          title: true,
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
}

export const action: ActionFunction = async ({ params, request }) => {
  const problemSetId = invariant(idScheme, params.problemSetId, {
    status: 404,
  });
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

function TitleEditor({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="标题" labelCol={{ span: 3 }} required>
        <Input
          id="title"
          name="title"
          type="text"
          defaultValue={title}
          disabled={isUpdating}
          required
        />
      </FormItem>
      <FormItem label="描述" labelCol={{ span: 3 }} required>
        <TextArea
          id="description"
          name="description"
          required
          defaultValue={description}
          disabled={isUpdating}
          autoSize={{ minRows: 3, maxRows: 10 }}
        />
      </FormItem>
      <FormItem label=" " labelCol={{ span: 3 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isUpdating}
          name="_action"
          value={ActionType.UpdateInformation}
        >
          提交捏
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function ProblemSetTagItem({ name }: { name: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <fetcher.Form
      method="post"
      style={{
        display: "inline",
        marginRight: 10,
      }}
      ref={formRef}
    >
      <input type="hidden" name="tag" value={name} />
      <input type="hidden" name="_action" value={ActionType.DeleteTag} />
      <Tag>
        {name}
        <Button
          icon={isDeleting ? <IconLoading /> : <IconDelete />}
          loading={isDeleting}
          onClick={() => fetcher.submit(formRef.current)}
        />
      </Tag>
    </fetcher.Form>
  );
}

function ProblemSetTagCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <Space direction="horizontal" size="medium">
        <Input
          id="tag"
          name="tag"
          type="text"
          disabled={isCreating}
          placeholder="输入标签"
          required
        />
        <Button
          type="primary"
          htmlType="submit"
          name="_action"
          value={ActionType.CreateTag}
          loading={isCreating}
        >
          添加捏
        </Button>
      </Space>
    </fetcher.Form>
  );
}

function ProblemSetTagEditor({ tags }: { tags: ProblemSetTag[] }) {
  return (
    <>
      {tags.length ? (
        <div>
          {tags.map(({ name }) => (
            <ProblemSetTagItem name={name} key={name} />
          ))}
        </div>
      ) : (
        <div>没有标签捏</div>
      )}
      <br />
      <ProblemSetTagCreator />
    </>
  );
}

function ProblemSetProblemItem({ pid }: { pid: number }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="pid" value={pid} />
      <Button
        type="primary"
        status="danger"
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

function ProblemEditor({
  problems,
}: {
  problems: Pick<Problem, "id" | "title">[];
}) {
  const tableColumns = [
    {
      title: "#",
      dataIndex: "id",
      render: (id: number) => <Link to={`/problem/${id}`}>{id}</Link>,
    },
    {
      title: "title",
      dataIndex: "title",
      render: (title: string, problem: Pick<Problem, "id" | "title">) => (
        <Link to={`/problem/${problem.id}`}>{title}</Link>
      ),
    },
    {
      title: "操作",
      render: (_: any, problem: Pick<Problem, "id" | "title">) => (
        <ProblemSetProblemItem pid={problem.id} />
      ),
    },
  ];
  return (
    <>
      <Table columns={tableColumns} data={problems} pagination={false} />
      <br />
      <ProblemSetProblemCreator />
    </>
  );
}

export default function ProblemSetEdit() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>标题与简介</h2>
      <TitleEditor
        title={problemSet.title}
        description={problemSet.description}
      />
      <h2>标签</h2>
      <ProblemSetTagEditor tags={problemSet.tags} />
      <h2>题目</h2>
      <ProblemEditor problems={problemSet.problems} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

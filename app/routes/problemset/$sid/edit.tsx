import { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import {
  json,
  useFetcher,
  MetaFunction,
  useLoaderData,
  ActionFunction,
  LoaderFunction,
  Link,
} from "remix";
import { db } from "~/utils/db.server";
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
    problems: Pick<Problem, "pid" | "title">[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const sid = invariant(idScheme.safeParse(params.sid), { status: 404 });

  const problemSet = await db.problemSet.findUnique({
    where: { sid },
    include: {
      tags: true,
      problems: {
        select: {
          pid: true,
          title: true,
        },
      },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet });
};

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  UpdateInformation = "updateInformation",
}

export const action: ActionFunction = async ({ params, request }) => {
  const sid = invariant(idScheme.safeParse(params.sid), { status: 404 });
  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const pid = invariant(idScheme.safeParse(form.get("pid")));

      await db.problemSet.update({
        where: { sid },
        data: {
          problems: {
            connect: {
              pid,
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteProblem: {
      const pid = invariant(idScheme.safeParse(form.get("pid")));

      await db.problemSet.update({
        where: { sid },
        data: {
          problems: {
            disconnect: {
              pid,
            },
          },
        },
      });

      return null;
    }

    case ActionType.CreateTag: {
      const tag = invariant(tagScheme.safeParse(form.get("tag")));

      await db.problemSet.update({
        where: { sid },
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
      const tag = invariant(tagScheme.safeParse(form.get("tag")));

      await db.problemSet.update({
        where: { sid },
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
      const title = invariant(titleScheme.safeParse(form.get("title")));
      const description = invariant(
        descriptionScheme.safeParse(form.get("description"))
      );

      await db.problemSet.update({
        where: { sid },
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

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
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
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form
      method="post"
      className="arco-form arco-form-horizontal arco-form-size-default"
      style={{ maxWidth: 600 }}
    >
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
          disabled={isUpdating}
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
  const isDeleting = fetcher.state !== "idle";
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
          disabled={isDeleting}
          onClick={() => fetcher.submit(formRef.current)}
        />
      </Tag>
    </fetcher.Form>
  );
}

function ProblemSetTagCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

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
          disabled={isCreating}
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
  const isDeleting = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="pid" value={pid} />
      <Button
        type="primary"
        status="danger"
        name="_action"
        value={ActionType.DeleteProblem}
        disabled={isDeleting}
        icon={<IconDelete />}
      />
    </fetcher.Form>
  );
}

function ProblemSetProblemCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

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
          disabled={isCreating}
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
  problems: Pick<Problem, "pid" | "title">[];
}) {
  const tableColumns = [
    {
      title: "pid",
      dataIndex: "pid",
      render: (pid: number) => <Link to={`/problem/${pid}`}>{pid}</Link>,
    },
    {
      title: "title",
      dataIndex: "title",
      render: (title: string, problem: Pick<Problem, "pid" | "title">) => (
        <Link to={`/problem/${problem.pid}`}>{title}</Link>
      ),
    },
    {
      title: "操作",
      render: (_: any, problem: Pick<Problem, "pid" | "title">) => (
        <ProblemSetProblemItem pid={problem.pid} />
      ),
    },
  ];
  return (
    <>
      <Table
        columns={tableColumns}
        data={problems}
        rowKey="pid"
        pagination={false}
      />
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

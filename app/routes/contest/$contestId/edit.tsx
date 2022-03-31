import { Contest, ContestSystem, ContestTag, Problem } from "@prisma/client";
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
  datetimeStringScheme,
  descriptionScheme,
  idScheme,
  systemScheme,
  tagScheme,
  timezoneScheme,
  titleScheme,
} from "~/utils/scheme";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Table,
  Space,
  Tag,
} from "@arco-design/web-react";
import { adjustTimezone, getDatetimeLocal } from "~/utils/time";
import { useState } from "react";
import { IconDelete, IconLoading } from "@arco-design/web-react/icon";
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

type LoaderData = {
  contest: Contest & {
    tags: ContestTag[];
    problems: Pick<Problem, "pid" | "title">[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const cid = invariant(idScheme.safeParse(params.contestId), { status: 404 });

  const contest = await db.contest.findUnique({
    where: { cid },
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

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({ contest });
};

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  UpdateInformation = "updateInformation",
  UpdateTime = "updateTime",
  UpdateSystem = "updateSystem",
}

export const action: ActionFunction = async ({ params, request }) => {
  const cid = invariant(idScheme.safeParse(params.contestId), { status: 404 });
  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const pid = invariant(idScheme.safeParse(form.get("pid")));

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
        data: {
          title,
          description,
        },
      });

      return null;
    }

    case ActionType.UpdateTime: {
      // 客户端所在的时区
      const timezone = invariant(
        timezoneScheme.safeParse(form.get("timezone"))
      );

      const beginTime = adjustTimezone(
        invariant(datetimeStringScheme.safeParse(form.get("beginTime"))),
        timezone
      );
      const endTime = adjustTimezone(
        invariant(datetimeStringScheme.safeParse(form.get("endTime"))),
        timezone
      );

      await db.contest.update({
        where: { cid },
        data: {
          beginTime,
          endTime,
        },
      });

      return null;
    }

    case ActionType.UpdateSystem: {
      const system = invariant(systemScheme.safeParse(form.get("system")));

      await db.contest.update({
        where: { cid },
        data: {
          system,
        },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `编辑比赛: ${data?.contest.title} - HITwh OJ`,
});

function ContestTagItem({ name }: { name: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <fetcher.Form
      method="post"
      style={{
        display: "inline",
        marginRight: 10,
      }}
    >
      <input type="hidden" name="tag" value={name} />
      <Tag>
        {name}
        <Button
          icon={isDeleting ? <IconLoading /> : <IconDelete />}
          loading={isDeleting}
          htmlType="submit"
          name="_action"
          value={ActionType.DeleteTag}
        />
      </Tag>
    </fetcher.Form>
  );
}

function ProblemDeleteIcon({ pid }: { pid: number }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" style={{ display: "inline" }}>
      <input type="hidden" name="pid" value={pid} />
      <input type="hidden" name="_action" value={ActionType.DeleteProblem} />
      <Button
        htmlType="submit"
        type="primary"
        icon={<IconDelete />}
        status="danger"
        loading={isDeleting}
      />
    </fetcher.Form>
  );
}

function ContestProblemList({
  problems,
}: {
  problems: Pick<Problem, "pid" | "title">[];
}) {
  const tableColumns = [
    {
      title: "PID",
      dataIndex: "pid",
      render: (pid: string) => <Link to={`${pid}`}>{pid}</Link>,
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (title: string, problem: Pick<Problem, "pid" | "title">) => (
        <Link to={`${problem.pid}`}>{title}</Link>
      ),
    },
    {
      title: "option",
      render: (_: any, problem: Pick<Problem, "pid" | "title">) => (
        <ProblemDeleteIcon pid={problem.pid} />
      ),
    },
  ];
  return <Table columns={tableColumns} data={problems} pagination={false} />;
}

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
    <fetcher.Form method="post">
      <FormItem label="标题" required labelCol={{ span: 2 }}>
        <Input
          name="title"
          defaultValue={title}
          disabled={isUpdating}
          required
        />
      </FormItem>
      <FormItem label="描述" required labelCol={{ span: 2 }}>
        <TextArea
          name="title"
          defaultValue={description}
          disabled={isUpdating}
          autoSize={{ minRows: 2, maxRows: 6 }}
          required
        />
      </FormItem>
      <FormItem label=" " labelCol={{ span: 2 }}>
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

function ContestTagCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <Space direction="horizontal" size="medium" style={{ marginTop: 10 }}>
        <Input
          id="tag"
          name="tag"
          type="text"
          disabled={isCreating}
          required
          placeholder="输入标签"
        />
        <Button
          htmlType="submit"
          type="primary"
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

function ContestProblemCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <Space direction="horizontal" size="medium" style={{ marginTop: 10 }}>
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

function TimeEditor({ begin, end }: { begin: Date; end: Date }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";
  const [beginTime, setBeginTime] = useState(begin.valueOf());
  const [endTime, setEndTime] = useState(end.valueOf() + 5 * 60 * 60 * 1000);

  return (
    <fetcher.Form method="post">
      <FormItem label="时间" required labelCol={{ span: 2 }}>
        <input
          type="hidden"
          name="beginTime"
          value={getDatetimeLocal(beginTime)}
          required
        />
        <input
          type="hidden"
          name="endTime"
          value={getDatetimeLocal(endTime)}
          required
        />
        <input
          type="hidden"
          name="timezone"
          value={new Date().getTimezoneOffset()}
        />
        <RangePicker
          defaultValue={[beginTime, endTime]}
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          allowClear={false}
          onChange={(dates) => {
            setBeginTime(new Date(dates[0]).valueOf());
            setEndTime(new Date(dates[1]).valueOf());
          }}
        />
      </FormItem>
      <FormItem label=" " labelCol={{ span: 2 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isUpdating}
          name="_action"
          value={ActionType.UpdateTime}
        >
          提交捏
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function SystemEditor(props: { system: ContestSystem }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";
  const [system, setSystem] = useState<ContestSystem>(props.system);

  return (
    <fetcher.Form method="post">
      <FormItem label="赛制" required labelCol={{ span: 2 }}>
        <input type="hidden" name="system" value={system} required />
        <Select
          value={system}
          onChange={(value) => {
            setSystem(value as ContestSystem);
          }}
          style={{ width: 150 }}
        >
          {Object.values(ContestSystem).map((system) => (
            <Option key={system} value={system} />
          ))}
        </Select>
      </FormItem>
      <FormItem label=" " labelCol={{ span: 2 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isUpdating}
          name="_action"
          value={ActionType.UpdateSystem}
        >
          提交捏
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

export default function ContestEdit() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>标题与简介</h2>
      <TitleEditor title={contest.title} description={contest.description} />

      <h2>时间</h2>
      <TimeEditor
        begin={new Date(contest.beginTime)}
        end={new Date(contest.endTime)}
      />

      <h2>赛制</h2>
      <SystemEditor system={contest.system} />

      <h2>标签</h2>
      {contest.tags.length ? (
        <div>
          {contest.tags.map(({ name }) => (
            <ContestTagItem name={name} key={name} />
          ))}
        </div>
      ) : (
        <div>没有标签捏</div>
      )}
      <ContestTagCreator />

      <h2>题目</h2>
      <ContestProblemList problems={contest.problems} />
      <ContestProblemCreator />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

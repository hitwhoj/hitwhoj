import type { Contest, ContestTag, Problem } from "@prisma/client";
import { ContestSystem } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
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
  Space,
  Tag,
  Typography,
  Message,
} from "@arco-design/web-react";
import { adjustTimezone, getDatetimeLocal } from "~/utils/time";
import { useEffect, useRef, useState } from "react";
import { IconLoading, IconPlus, IconTag } from "@arco-design/web-react/icon";
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

type LoaderData = {
  contest: Contest & {
    tags: ContestTag[];
    problems: Pick<Problem, "id" | "title">[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });

  const contest = await db.contest.findUnique({
    where: { id: contestId },
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

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return { contest };
};

enum ActionType {
  CreateTag = "CreateTag",
  DeleteTag = "DeleteTag",
  CreateProblem = "CreateProblem",
  DeleteProblem = "DeleteProblem",
  UpdateInformation = "UpdateInformation",
}

export const action: ActionFunction = async ({ params, request }) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });
  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.contest.update({
        where: { id: contestId },
        data: {
          problems: { connect: { id: problemId } },
        },
      });

      return null;
    }

    case ActionType.DeleteProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.contest.update({
        where: { id: contestId },
        data: { problems: { disconnect: { id: problemId } } },
      });

      return null;
    }

    case ActionType.CreateTag: {
      const tag = invariant(tagScheme, form.get("tag"));

      await db.contest.update({
        where: { id: contestId },
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

      await db.contest.update({
        where: { id: contestId },
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

      // 客户端所在的时区
      const timezone = invariant(timezoneScheme, form.get("timezone"));

      const beginTime = adjustTimezone(
        invariant(datetimeStringScheme, form.get("beginTime")),
        timezone
      );
      const endTime = adjustTimezone(
        invariant(datetimeStringScheme, form.get("endTime")),
        timezone
      );

      const system = invariant(systemScheme, form.get("system"));

      await db.contest.update({
        where: { id: contestId },
        data: {
          title,
          description,
          beginTime,
          endTime,
          system,
        },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `编辑比赛: ${data?.contest.title} - HITwh OJ`,
});

function ContestInformationEditor({
  contest,
}: {
  contest: Contest & { tags: Pick<ContestTag, "name">[] };
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state === "submitting";

  const [beginTime, setBeginTime] = useState(
    new Date(contest.beginTime).getTime()
  );
  const [endTime, setEndTime] = useState(new Date(contest.endTime).getTime());
  const [system, setSystem] = useState(contest.system);

  useEffect(() => {
    if (!isUpdating && fetcher.submission) {
      Message.success("更新成功");
    }
  }, [isUpdating]);

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="标题" required>
        <Input
          name="title"
          defaultValue={contest.title}
          disabled={isUpdating}
          required
        />
      </FormItem>

      <FormItem label="描述" required>
        <TextArea
          name="description"
          defaultValue={contest.description}
          disabled={isUpdating}
          required
        />
      </FormItem>

      <FormItem label="时间" required>
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
          required
        />
        <RangePicker
          defaultValue={[beginTime, endTime]}
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          allowClear={false}
          onChange={(dates) => {
            setBeginTime(new Date(dates[0]).getTime());
            setEndTime(new Date(dates[1]).getTime());
          }}
        />
      </FormItem>

      <FormItem label="赛制" required>
        <input type="hidden" name="system" value={system} required />
        <Select
          value={system}
          onChange={(value) => setSystem(value as ContestSystem)}
          style={{ width: 150 }}
          disabled={isUpdating}
        >
          {Object.values(ContestSystem).map((system) => (
            <Option key={system} value={system} />
          ))}
        </Select>
      </FormItem>

      <FormItem wrapperCol={{ offset: 5 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={isUpdating}
          name="_action"
          value={ActionType.UpdateInformation}
        >
          提交更新
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function ContestTagItem({ name }: { name: string }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (fetcher.submission && !isUpdating) {
      setVisible(false);
    }
  }, [isUpdating]);

  return (
    <Tag
      closable
      visible={visible}
      icon={isUpdating ? <IconLoading /> : <IconTag />}
      onClose={() => fetcher.submit(formRef.current)}
    >
      {name}
      <fetcher.Form method="post" ref={formRef}>
        <input type="hidden" name="tag" value={name} />
        <input type="hidden" name="_action" value={ActionType.DeleteTag} />
      </fetcher.Form>
    </Tag>
  );
}

function ContestTagEditor({ tags }: { tags: Pick<ContestTag, "name">[] }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (fetcher.submission && !isUpdating) {
      setShowInput(false);
    }
  }, [isUpdating]);

  return (
    <Space>
      {tags.map(({ name }) => (
        <ContestTagItem key={name} name={name} />
      ))}

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
            disabled={isUpdating}
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
    </Space>
  );
}

export default function ContestEdit() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>修改比赛信息</Typography.Title>
      <ContestInformationEditor contest={contest} />
      <FormItem label="标签" style={{ maxWidth: 600 }}>
        <ContestTagEditor tags={contest.tags} />
      </FormItem>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

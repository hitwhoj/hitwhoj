import type {
  Contest,
  ContestProblem,
  ContestTag,
  Problem,
} from "@prisma/client";
import { ContestSystem } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
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
  Alert,
  Table,
  Checkbox,
} from "@arco-design/web-react";
import { adjustTimezone, getDatetimeLocal } from "~/utils/time";
import { useEffect, useRef, useState } from "react";
import {
  IconCheck,
  IconDelete,
  IconDown,
  IconLoading,
  IconPlus,
  IconTag,
  IconUp,
} from "@arco-design/web-react/icon";
import { checkContestWritePermission } from "~/utils/permission/contest";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

type LoaderData = {
  contest: Pick<
    Contest,
    | "id"
    | "title"
    | "description"
    | "beginTime"
    | "endTime"
    | "system"
    | "private"
  > & {
    tags: ContestTag[];
    problems: (Pick<ContestProblem, "rank"> & {
      problem: Pick<Problem, "id" | "title">;
    })[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });

  await checkContestWritePermission(request, contestId);

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      description: true,
      beginTime: true,
      endTime: true,
      system: true,
      private: true,
      tags: true,
      problems: {
        orderBy: { rank: "asc" },
        select: {
          rank: true,
          problem: {
            select: {
              id: true,
              title: true,
            },
          },
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
  MoveProblemUp = "MoveProblemUp",
  MoveProblemDown = "MoveProblemDown",
}

type ActionData =
  | {
      success: true;
    }
  | {
      success: false;
      reason: string;
    };

export const action: ActionFunction<ActionData> = async ({
  params,
  request,
}) => {
  const contestId = invariant(idScheme, params.contestId, {
    status: 404,
  });
  await checkContestWritePermission(request, contestId);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    // 创建题目
    case ActionType.CreateProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const {
          _max: { rank },
        } = await db.contestProblem.aggregate({
          where: { contestId },
          _max: { rank: true },
        });

        await db.contest.update({
          where: { id: contestId },
          data: {
            problems: {
              create: {
                problemId,
                rank: (rank ?? 0) + 1,
              },
            },
          },
        });
      });

      return { success: true };
    }

    // 删除题目
    case ActionType.DeleteProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const { rank } = await db.contestProblem.delete({
          where: {
            contestId_problemId: {
              contestId,
              problemId,
            },
          },
        });

        await db.contestProblem.updateMany({
          where: { contestId, rank: { gte: rank } },
          data: { rank: { decrement: 1 } },
        });
      });

      return { success: true };
    }

    case ActionType.MoveProblemUp:
    case ActionType.MoveProblemDown: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const record = await db.contestProblem.findUnique({
          where: {
            contestId_problemId: {
              contestId,
              problemId,
            },
          },
        });

        if (!record) {
          throw new Response("Problem not found", { status: 400 });
        }

        // 获取交换的题目
        const target = await db.contestProblem.findUnique({
          where: {
            contestId_rank: {
              contestId,
              rank:
                _action === ActionType.MoveProblemUp
                  ? record.rank - 1
                  : record.rank + 1,
            },
          },
        });

        if (!target) {
          throw new Response("Cannot move problem", { status: 400 });
        }

        // 删除原来的排名
        await db.contestProblem.delete({
          where: { contestId_rank: { contestId, rank: record.rank } },
        });
        await db.contestProblem.delete({
          where: { contestId_rank: { contestId, rank: target.rank } },
        });

        // 添加新的排名
        await db.contestProblem.createMany({
          data: [
            { contestId, problemId: record.problemId, rank: target.rank },
            { contestId, problemId: target.problemId, rank: record.rank },
          ],
        });
      });

      return { success: true };
    }

    // 创建标签
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

      return { success: true };
    }

    // 删除标签
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

      return { success: true };
    }

    // 更新比赛信息
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
      const priv = form.get("private") === "true";

      await db.contest.update({
        where: { id: contestId },
        data: {
          title,
          description,
          beginTime,
          endTime,
          system,
          private: priv,
        },
      });

      return { success: true };
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
  contest: Pick<
    Contest,
    | "id"
    | "title"
    | "description"
    | "beginTime"
    | "endTime"
    | "system"
    | "private"
  > & { tags: Pick<ContestTag, "name">[] };
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  const [beginTime, setBeginTime] = useState(
    new Date(contest.beginTime).getTime()
  );
  const [endTime, setEndTime] = useState(new Date(contest.endTime).getTime());
  const [system, setSystem] = useState(contest.system);
  const [priv, setPriv] = useState(contest.private);

  useEffect(() => {
    if (!isUpdating && fetcher.submission) {
      Message.success("更新成功");
    }
  }, [isUpdating]);

  return (
    <fetcher.Form method="post" style={{ maxWidth: 600 }}>
      <FormItem label="标题" required layout="vertical">
        <Input
          name="title"
          defaultValue={contest.title}
          disabled={isUpdating}
          required
        />
      </FormItem>

      <FormItem label="描述" required layout="vertical">
        <TextArea
          name="description"
          defaultValue={contest.description}
          disabled={isUpdating}
        />
      </FormItem>

      <FormItem label="时间" required layout="vertical">
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
          disabled={isUpdating}
        />
      </FormItem>

      <FormItem label="赛制" required layout="vertical">
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
          icon={<IconCheck />}
          loading={isUpdating}
          name="_action"
          value={ActionType.UpdateInformation}
        >
          确认更新
        </Button>
      </FormItem>
    </fetcher.Form>
  );
}

function ContestTagItem({ name }: { name: string }) {
  const fetcher = useFetcher<ActionData>();
  const isUpdating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (fetcher.data && !isUpdating) {
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
      <fetcher.Form method="post" ref={formRef} hidden>
        <input type="hidden" name="tag" value={name} />
        <input type="hidden" name="_action" value={ActionType.DeleteTag} />
      </fetcher.Form>
    </Tag>
  );
}

function ContestTagEditor({ tags }: { tags: Pick<ContestTag, "name">[] }) {
  const fetcher = useFetcher<ActionData>();
  const isUpdating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    if (fetcher.data && !isUpdating) {
      setShowInput(false);
    }
  }, [isUpdating]);

  return (
    <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap" }}>
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
    </div>
  );
}

function ContestProblemEditItem({
  id,
  isFirst,
  isLast,
}: {
  id: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="pid" value={id} />
      <Space>
        <Button
          type="primary"
          icon={<IconDelete />}
          size="mini"
          status="danger"
          disabled={isUpdating}
          htmlType="submit"
          name="_action"
          value={ActionType.DeleteProblem}
        />
        <Button
          type="default"
          icon={<IconUp />}
          size="mini"
          disabled={isFirst || isUpdating}
          htmlType="submit"
          name="_action"
          value={ActionType.MoveProblemUp}
        />
        <Button
          type="default"
          icon={<IconDown />}
          size="mini"
          disabled={isLast || isUpdating}
          htmlType="submit"
          name="_action"
          value={ActionType.MoveProblemDown}
        />
      </Space>
    </fetcher.Form>
  );
}

function ContestProblemEditor({
  problems,
}: {
  problems: (Pick<ContestProblem, "rank"> & {
    problem: Pick<Problem, "id" | "title">;
  })[];
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <>
      <Typography.Paragraph>
        <fetcher.Form method="post">
          <Space>
            <Input
              name="pid"
              placeholder="请输入题目 ID"
              pattern="\d+"
              disabled={isUpdating}
              required
            />
            <Button
              type="primary"
              icon={<IconPlus />}
              htmlType="submit"
              name="_action"
              value={ActionType.CreateProblem}
              loading={isUpdating}
            >
              添加题目
            </Button>
          </Space>
        </fetcher.Form>
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Table
          columns={[
            {
              title: "#",
              dataIndex: "rank",
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
              render(rank) {
                return String.fromCharCode(0x40 + rank);
              },
            },
            {
              title: "题目",
              render(_, { problem }) {
                return (
                  <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
                );
              },
            },
            {
              title: "操作",
              render(_, { rank, problem }) {
                return (
                  <ContestProblemEditItem
                    id={problem.id}
                    isFirst={rank === 1}
                    isLast={rank === problems.length}
                  />
                );
              },
              align: "center",
              cellStyle: { width: "5%", whiteSpace: "nowrap" },
            },
          ]}
          data={problems}
          rowKey="id"
          hover={false}
          border={false}
          pagination={false}
        />
      </Typography.Paragraph>
    </>
  );
}

export default function ContestEdit() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>修改比赛信息</Typography.Title>
      <FormItem label="标签" layout="vertical">
        <ContestTagEditor tags={contest.tags} />
      </FormItem>
      <ContestInformationEditor contest={contest} />
      <Typography.Title heading={4}>修改比赛题目</Typography.Title>
      {new Date() > new Date(contest.beginTime) && (
        <Typography.Paragraph>
          <Alert
            type="warning"
            content="如果您在比赛开始后修改题目，系统可能会出现一些奇妙的特性"
          />
        </Typography.Paragraph>
      )}
      <ContestProblemEditor problems={contest.problems} />
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

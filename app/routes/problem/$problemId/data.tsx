import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import {
  createProblemData,
  createProblemFile,
  removeFile,
} from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import {
  Typography,
  Form as ArcoForm,
  Select,
  Grid,
  Button,
  Input,
} from "@arco-design/web-react";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findProblemTeam } from "~/utils/db/problem";
import { FileList } from "~/src/file/FileList";
import { FileUploader } from "~/src/file/FileUploader";
import { s3 } from "~/utils/server/s3.server";
import { useState } from "react";
import type {
  ConfigJson,
  ConfigSubtask,
  ConfigTaskDefault,
} from "~/utils/server/judge/judge.types";
import { IconPlus } from "@arco-design/web-react/icon";

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
      title: true,
      files: { orderBy: { filename: "asc" } },
      data: { orderBy: { filename: "asc" } },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  const file = await db.file.findFirst({
    where: { dataProblemId: problemId, filename: "config.json" },
    select: { id: true },
  });
  const config =
    file && (await s3.readFile(`/file/${file.id}`)).toString("utf-8");

  return json({ problem, config });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑数据: ${data?.problem.title} - HITwh OJ`,
});

enum ActionType {
  UploadData = "uploadData",
  UploadFile = "uploadFile",
  RemoveData = "removeData",
  RemoveFile = "removeFile",
}

export async function action({ request, params }: ActionArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

  const form = await unstable_parseMultipartFormData(request, handler);

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UploadData:
    case ActionType.UploadFile: {
      const files = form
        .getAll("file")
        .filter((file): file is File => file instanceof File);

      if (!files.length) {
        throw new Response("Invalid file", { status: 400 });
      }

      // 保存文件
      await Promise.all(
        files.map((file) => {
          return _action === ActionType.UploadData
            ? createProblemData(file, problemId)
            : createProblemFile(file, problemId);
        })
      );

      return null;
    }

    case ActionType.RemoveData:
    case ActionType.RemoveFile: {
      const fid = invariant(uuidScheme, form.get("fid"));

      // 删除文件
      await removeFile(fid);

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
}

type FilenameSelectProps = {
  data: string[];
  value: string;
  onChange: (value: string) => void;
};

function FilenameSelect({ data, ...props }: FilenameSelectProps) {
  return (
    <Select style={{ maxWidth: 150 }} {...props}>
      {data.map((value, index) => (
        <Select.Option value={value} key={index}>
          {value}
        </Select.Option>
      ))}
    </Select>
  );
}

const DEFAULT_TIME_LIMIT = 1000;
const DEFAULT_MEMORY_LIMIT = 268435456;

type ProblemDataConfigEditorProps = {
  config: ConfigJson;
  datanames: string[];
};

function ProblemDataConfigEditor({
  config: defaultConfig,
  datanames,
}: ProblemDataConfigEditorProps) {
  const fetcher = useFetcher();
  const [config, setConfig] = useState(defaultConfig);

  return (
    <fetcher.Form method="post">
      <FormItem label="评测方式" required>
        <Select
          value={config.type}
          style={{ maxWidth: 150 }}
          onChange={(value) => {
            if (value === "default")
              setConfig({ type: "default", subtasks: [] });
            else if (value === "interactive")
              setConfig({ type: "interactive", interactive: "" });
            else if (value === "dynamic")
              setConfig({ type: "dynamic", mkdata: "", std: "", subtasks: [] });
            else setConfig({ type: "submit_answer", answer: "" });
          }}
        >
          <Select.Option value="default">默认</Select.Option>
          <Select.Option value="interactive">交互</Select.Option>
          <Select.Option value="dynamic">动态</Select.Option>
          <Select.Option value="submit_answer">提答</Select.Option>
        </Select>
      </FormItem>

      {config.type === "default" && (
        <>
          <FormItem label="时间限制 (ms)">
            <Input
              type="number"
              style={{ maxWidth: 150 }}
              value={String(config.time)}
              onChange={(value) =>
                setConfig((config) => ({
                  ...config,
                  time: Number(value),
                }))
              }
              placeholder={String(DEFAULT_TIME_LIMIT)}
            />
          </FormItem>
          <FormItem label="内存限制 (byte)">
            <Input
              type="number"
              style={{ maxWidth: 150 }}
              value={String(config.memory)}
              onChange={(value) =>
                setConfig((config) => ({
                  ...config,
                  memory: Number(value),
                }))
              }
              placeholder={String(DEFAULT_MEMORY_LIMIT)}
            />
          </FormItem>
          <Typography.Title heading={5}>
            <Grid.Row justify="space-between" align="center">
              <Typography.Text>子任务配置</Typography.Text>
              <Button
                icon={<IconPlus />}
                onClick={() =>
                  setConfig((config) => ({
                    ...config,
                    subtasks: [
                      ...(config as Extract<ConfigJson, { type: "default" }>)
                        .subtasks,
                      { score: 20, cases: [] },
                    ],
                  }))
                }
              >
                添加子任务
              </Button>
            </Grid.Row>
          </Typography.Title>
          {config.subtasks.map((subtask, index) => {
            const setSubtask = (
              fn: (
                subtask: ConfigSubtask<ConfigTaskDefault>
              ) => ConfigSubtask<ConfigTaskDefault>
            ) =>
              setConfig((_config) => {
                const config = _config as Extract<
                  ConfigJson,
                  { type: "default" }
                >;
                config.subtasks[index] = fn(config.subtasks[index]);
                return { ...config };
              });

            return (
              <blockquote key={index}>
                <FormItem label="子任务分数">
                  <Input
                    type="number"
                    style={{ maxWidth: 150 }}
                    value={String(subtask.score)}
                    onChange={(value) =>
                      setSubtask((subtask) => ({
                        ...subtask,
                        score: Number(value),
                      }))
                    }
                  />
                </FormItem>

                <FormItem label="子任务时间限制 (ms)">
                  <Input
                    type="number"
                    style={{ maxWidth: 150 }}
                    value={String(subtask.time)}
                    onChange={(value) =>
                      setSubtask((subtask) => ({
                        ...subtask,
                        time: Number(value),
                      }))
                    }
                    placeholder={String(config.time ?? DEFAULT_TIME_LIMIT)}
                  />
                </FormItem>
                <FormItem label="子任务内存限制 (byte)">
                  <Input
                    type="number"
                    style={{ maxWidth: 150 }}
                    value={String(subtask.memory)}
                    onChange={(value) =>
                      setSubtask((subtask) => ({
                        ...subtask,
                        memory: Number(value),
                      }))
                    }
                    placeholder={String(config.memory ?? DEFAULT_MEMORY_LIMIT)}
                  />
                </FormItem>

                <Typography.Title heading={6}>
                  <Grid.Row justify="space-between" align="center">
                    <Typography.Text>测试点配置</Typography.Text>
                    <Button
                      icon={<IconPlus />}
                      onClick={() =>
                        setSubtask((subtask) => ({
                          ...subtask,
                          cases: [...subtask.cases, { input: "", output: "" }],
                        }))
                      }
                    >
                      添加测试点
                    </Button>
                  </Grid.Row>
                </Typography.Title>
                {subtask.cases.map((task, index) => {
                  const setTask = (
                    fn: (task: ConfigTaskDefault) => ConfigTaskDefault
                  ) =>
                    setSubtask((subtask) => {
                      subtask.cases[index] = fn(subtask.cases[index]);
                      return { ...subtask };
                    });

                  return (
                    <blockquote key={index}>
                      <FormItem label="输入文件" required>
                        <FilenameSelect
                          data={datanames}
                          value={task.input}
                          onChange={(value) =>
                            setTask((task) => ({ ...task, input: value }))
                          }
                        />
                      </FormItem>
                      <FormItem label="输出文件" required>
                        <FilenameSelect
                          data={datanames}
                          value={task.output}
                          onChange={(value) =>
                            setTask((task) => ({ ...task, output: value }))
                          }
                        />
                      </FormItem>
                    </blockquote>
                  );
                })}
              </blockquote>
            );
          })}
        </>
      )}

      {config.type === "interactive" && (
        <>
          <FormItem label="交互代码" required>
            <FilenameSelect
              data={datanames}
              value={config.interactive}
              onChange={(value) =>
                setConfig((config) => ({ ...config, interactive: value }))
              }
            />
          </FormItem>
        </>
      )}

      {config.type === "dynamic" && (
        <>
          <FormItem label="数据构造代码 (mkdata.cpp)" required>
            <FilenameSelect
              data={datanames}
              value={config.mkdata}
              onChange={(value) =>
                setConfig((config) => ({ ...config, mkdata: value }))
              }
            />
          </FormItem>
          <FormItem label="标准代码 (std.cpp)" required>
            <FilenameSelect
              data={datanames}
              value={config.std}
              onChange={(value) =>
                setConfig((config) => ({ ...config, std: value }))
              }
            />
          </FormItem>
        </>
      )}
    </fetcher.Form>
  );
}

export default function ProblemData() {
  const {
    problem: { files, data },
    config: rawConfig,
  } = useLoaderData<typeof loader>();

  const datafiles = data.filter(({ filename }) => filename !== "config.json");

  const config = rawConfig
    ? JSON.parse(rawConfig)
    : { type: "default", subtasks: [] };

  return (
    <Typography>
      <Typography.Title heading={4}>测试数据</Typography.Title>

      <Typography.Title heading={5}>配置</Typography.Title>
      <Typography.Paragraph>
        <ProblemDataConfigEditor
          config={config}
          datanames={datafiles.map(({ filename }) => filename)}
        />
      </Typography.Paragraph>

      <Typography.Title heading={5}>
        <Grid.Row justify="space-between" align="center">
          <Typography.Text>数据文件</Typography.Text>
          <FileUploader uploadAction={ActionType.UploadData} />
        </Grid.Row>
      </Typography.Title>
      <Typography.Paragraph>
        <FileList files={datafiles} deleteAction={ActionType.RemoveData} />
      </Typography.Paragraph>

      <Typography.Title heading={4}>
        <Grid.Row justify="space-between" align="center">
          <Typography.Text>附加文件</Typography.Text>
          <FileUploader uploadAction={ActionType.UploadFile} />
        </Grid.Row>
      </Typography.Title>
      <Typography.Paragraph>
        题目的附加资料，例如样例数据、PDF 题面等
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FileList files={files} deleteAction={ActionType.RemoveFile} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

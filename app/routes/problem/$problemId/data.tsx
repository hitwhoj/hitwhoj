import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import {
  createProblemData,
  createProblemFile,
  removeFile,
} from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findProblemTeam } from "~/utils/db/problem";
import { FileList } from "~/src/file/FileList";
import { FileUploader } from "~/src/file/FileUploader";
import { s3 } from "~/utils/server/s3.server";
import type { SelectHTMLAttributes } from "react";
import { useState } from "react";
import type {
  ConfigJson,
  ConfigSubtask,
  ConfigTaskDefault,
} from "~/utils/server/judge/judge.types";
import {
  HiOutlineArrowsExpand,
  HiOutlineChevronLeft,
  HiOutlinePlus,
} from "react-icons/hi";
import Fullscreen from "~/src/Fullscreen";

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

type DataSelectProps = {
  options: string[];
} & SelectHTMLAttributes<HTMLSelectElement>;

function DataSelect({ options, ...props }: DataSelectProps) {
  return (
    <select className="select select-bordered" {...props}>
      {options.map((value) => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

const DEFAULT_TIME_LIMIT = 1000;
const DEFAULT_MEMORY_LIMIT = 268435456; // 256MB

type ConfigJSONEditorProps = {
  config: ConfigJson;
  data: string[];
};

function ConfigJSONEditor({
  config: defaultConfig,
  data,
}: ConfigJSONEditorProps) {
  const [config, setConfig] = useState(defaultConfig);

  return (
    <div className="flex flex-col gap-2">
      <div className="form-control">
        <label className="label">
          <span className="label-text">评测方式</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={config.type}
          onChange={(event) => {
            const value = event.target.value as ConfigJson["type"];
            if (value === "default")
              setConfig({ type: "default", subtasks: [] });
            else if (value === "interactive")
              setConfig({ type: "interactive", interactive: "" });
            else if (value === "dynamic")
              setConfig({ type: "dynamic", mkdata: "", std: "", subtasks: [] });
            else setConfig({ type: "submit_answer", answer: "" });
          }}
        >
          <option value="default">默认</option>
          <option value="interactive">交互</option>
          <option value="dynamic">动态</option>
          <option value="submit_answer">提答</option>
        </select>
      </div>

      {config.type === "default" && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">时间限制 (ms)</span>
            </label>
            <input
              className="input input-bordered"
              type="number"
              value={config.time}
              onChange={(event) => {
                setConfig((config) => ({
                  ...config,
                  time: Number(event.target.value),
                }));
              }}
              placeholder={DEFAULT_TIME_LIMIT.toString()}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">内存限制 (byte)</span>
            </label>
            <input
              className="input input-bordered"
              type="number"
              value={config.memory}
              onChange={(event) => {
                setConfig((config) => ({
                  ...config,
                  memory: Number(event.target.value),
                }));
              }}
              placeholder={DEFAULT_MEMORY_LIMIT.toString()}
            />
          </div>

          <h3 className="flex justify-between items-center">
            <span>子任务配置</span>
            <button
              className="btn btn-primary"
              onClick={() => {
                setConfig((config) => ({
                  ...config,
                  subtasks: [
                    ...(config as Extract<ConfigJson, { type: "default" }>)
                      .subtasks,
                    { score: 20, cases: [] },
                  ],
                }));
              }}
            >
              <HiOutlinePlus />
              <span>添加子任务</span>
            </button>
          </h3>

          {config.subtasks.map((subtask, index) => {
            const setSubtask = (
              fn: (
                subtask: ConfigSubtask<ConfigTaskDefault>
              ) => ConfigSubtask<ConfigTaskDefault>
            ) => {
              setConfig((_config) => {
                const config = _config as Extract<
                  ConfigJson,
                  { type: "default" }
                >;
                config.subtasks[index] = fn(config.subtasks[index]);
                return { ...config };
              });
            };

            return (
              <div className="card" key={index}>
                <div className="card-body gap-2">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">子任务分数</span>
                    </label>
                    <input
                      className="input input-bordered"
                      type="number"
                      value={subtask.score}
                      onChange={(value) => {
                        setSubtask((subtask) => ({
                          ...subtask,
                          score: Number(value),
                        }));
                      }}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">子任务时间限制 (ms)</span>
                    </label>
                    <input
                      className="input input-bordered"
                      type="number"
                      value={subtask.time}
                      onChange={(value) => {
                        setSubtask((subtask) => ({
                          ...subtask,
                          time: Number(value),
                        }));
                      }}
                      placeholder={(
                        config.time ?? DEFAULT_TIME_LIMIT
                      ).toString()}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">子任务内存限制 (byte)</span>
                    </label>
                    <input
                      className="input input-bordered"
                      type="number"
                      value={subtask.memory}
                      onChange={(value) => {
                        setSubtask((subtask) => ({
                          ...subtask,
                          memory: Number(value),
                        }));
                      }}
                      placeholder={(
                        config.memory ?? DEFAULT_MEMORY_LIMIT
                      ).toString()}
                    />
                  </div>

                  <h4 className="flex justify-between items-center">
                    <span>测试点配置</span>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        setSubtask((subtask) => ({
                          ...subtask,
                          cases: [...subtask.cases, { input: "", output: "" }],
                        }))
                      }
                    >
                      <HiOutlinePlus />
                      <span>添加测试点</span>
                    </button>
                  </h4>

                  {subtask.cases.map((task, index) => {
                    const setTask = (
                      fn: (task: ConfigTaskDefault) => ConfigTaskDefault
                    ) => {
                      setSubtask((subtask) => {
                        subtask.cases[index] = fn(subtask.cases[index]);
                        return { ...subtask };
                      });
                    };

                    return (
                      <div className="flex flex-col gap-2" key={index}>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">输入文件</span>
                          </label>
                          <DataSelect
                            options={data}
                            value={task.input}
                            onChange={(event) => {
                              setTask((task) => ({
                                ...task,
                                input: event.target.value,
                              }));
                            }}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">输出文件</span>
                          </label>
                          <DataSelect
                            options={data}
                            value={task.output}
                            onChange={(event) => {
                              setTask((task) => ({
                                ...task,
                                output: event.target.value,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {config.type === "interactive" && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">交互代码</span>
            </label>
            <DataSelect
              options={data}
              value={config.interactive}
              onChange={(event) => {
                setConfig((config) => ({
                  ...config,
                  interactive: event.target.value,
                }));
              }}
            />
          </div>
        </>
      )}

      {config.type === "dynamic" && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">数据构造代码 (mkdata.cpp)</span>
            </label>
            <DataSelect
              options={data}
              value={config.mkdata}
              onChange={(event) => {
                setConfig((config) => ({
                  ...config,
                  interactive: event.target.value,
                }));
              }}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">标准代码 (std.cpp)</span>
            </label>
            <DataSelect
              options={data}
              value={config.std}
              onChange={(event) => {
                setConfig((config) => ({
                  ...config,
                  std: event.target.value,
                }));
              }}
            />
          </div>
        </>
      )}

      {config.type === "submit_answer" && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">答案</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            value={config.answer}
            onChange={(event) => {
              setConfig((config) => ({
                ...config,
                answer: event.target.value,
              }));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function ProblemData() {
  const {
    problem: { files, data },
    config: rawConfig,
  } = useLoaderData<typeof loader>();

  const dataWithoutConfig = data.filter(
    ({ filename }) => filename !== "config.json"
  );
  const config = rawConfig
    ? JSON.parse(rawConfig)
    : { type: "default", subtasks: [] };
  const [visible, setVisible] = useState(false);

  return (
    <>
      <h2 className="flex justify-between items-center">
        <span>测试数据</span>
        <span className="inline-flex gap-4 items-center">
          <button
            className="btn btn-primary gap-2"
            onClick={() => setVisible(true)}
          >
            <span>配置</span>
            <HiOutlineArrowsExpand />
          </button>
          <FileUploader uploadAction={ActionType.UploadData} />
        </span>
      </h2>
      <p>用于评测的数据文件</p>
      <FileList files={data} deleteAction={ActionType.RemoveData} />

      <h2 className="flex justify-between items-center">
        <span>附加文件</span>
        <FileUploader uploadAction={ActionType.UploadFile} />
      </h2>
      <p>题目的附加资料，例如样例数据、PDF 题面等</p>
      <FileList files={files} deleteAction={ActionType.RemoveFile} />

      <Fullscreen visible={visible} className="bg-base-100 overflow-auto">
        <div className="w-full max-w-xl p-4 mx-auto">
          <button
            className="btn btn-ghost gap-2"
            onClick={() => setVisible(false)}
          >
            <HiOutlineChevronLeft />
            <span>返回</span>
          </button>

          <h2>配置评测信息</h2>

          <ConfigJSONEditor
            config={config}
            data={dataWithoutConfig.map(({ filename }) => filename)}
          />
        </div>
      </Fullscreen>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

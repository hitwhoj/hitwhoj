import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
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
import { useEffect } from "react";
import { useCallback } from "react";
import type {
  ConfigJson,
  ConfigSubtask,
  ConfigTaskDefault,
} from "~/utils/server/judge/judge.types";
import {
  HiOutlineArrowsExpand,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineX,
} from "react-icons/hi";
import Fullscreen from "~/src/Fullscreen";
import { z } from "zod";
import Highlighter from "~/src/Highlighter";
import { useSignalFetcher, useSignalLoaderData } from "~/utils/hooks";
import type { Signal } from "@preact/signals-react";
import { useComputed, useSignal } from "@preact/signals-react";
import { useToasts } from "~/utils/toast";

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
  UpdateConfig = "updateConfig",
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

    case ActionType.UpdateConfig: {
      const config = invariant(z.string().nonempty(), form.get("config"));

      await db.$transaction(async (db) => {
        // remove old config
        const data = await db.file.findMany({
          where: {
            filename: "config.json",
            dataProblemId: problemId,
          },
          select: { id: true },
        });
        await Promise.all(data.map(({ id }) => removeFile(id)));

        // create new config
        await createProblemData(
          new File([config], "config.json", { type: "application/json" }),
          problemId
        );
      });

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
      <option value="" disabled>
        选择文件
      </option>
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

type EditorProps<T> = {
  config: Signal<T>;
  data: string[];
};
type DefaultConfig = Extract<ConfigJson, { type: "default" }>;
type DefaultConfigEditorProps = EditorProps<DefaultConfig>;

function DefaultConfigEditor(props: DefaultConfigEditorProps) {
  const handleAddSubtask = useCallback(() => {
    props.config.value = {
      ...props.config.value,
      subtasks: [...props.config.value.subtasks, { score: 20, cases: [] }],
    };
  }, [props.config.value]);

  const diagnostics = useComputed(() => {
    const totalScore = props.config.value.subtasks.reduce(
      (prev, cur) => prev + cur.score,
      0
    );
    const hasEmptySubtask = props.config.value.subtasks.some(
      (subtask) => subtask.cases.length === 0
    );
    const hasEmptyTask = props.config.value.subtasks.some((subtask) =>
      subtask.cases.some((task) => task.input === "" || task.output === "")
    );
    const hasInvalidScore = totalScore !== 100;
    const allFiles = props.config.value.subtasks
      .flatMap((subtask) =>
        subtask.cases.flatMap((task) => [task.input, task.output])
      )
      .filter((file) => file !== "");
    const hasDuplicatedFile = new Set(allFiles).size !== allFiles.length;

    return {
      hasEmptySubtask,
      hasEmptyTask,
      hasInvalidScore,
      hasDuplicatedFile,
    };
  });

  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">时间限制 (ms)</span>
        </label>
        <input
          className="input input-bordered"
          type="number"
          value={props.config.value.time}
          onChange={(event) => {
            props.config.value = {
              ...props.config.value,
              time: Number(event.target.value),
            };
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
          value={props.config.value.memory}
          onChange={(event) => {
            props.config.value = {
              ...props.config.value,
              memory: Number(event.target.value),
            };
          }}
          placeholder={DEFAULT_MEMORY_LIMIT.toString()}
        />
      </div>

      <h3 className="flex items-center justify-between">
        <span>子任务配置</span>
        <button className="btn btn-primary gap-2" onClick={handleAddSubtask}>
          <HiOutlinePlus />
          <span>添加子任务</span>
        </button>
      </h3>

      {props.config.value.subtasks.map((subtask, index) => {
        const setSubtask = (subtask: ConfigSubtask<ConfigTaskDefault>) => {
          props.config.value = {
            ...props.config.value,
            subtasks: [
              ...props.config.value.subtasks.slice(0, index),
              subtask,
              ...props.config.value.subtasks.slice(index + 1),
            ],
          };
        };
        const handleRemoveSubtask = () => {
          props.config.value = {
            ...props.config.value,
            subtasks: [
              ...props.config.value.subtasks.slice(0, index),
              ...props.config.value.subtasks.slice(index + 1),
            ],
          };
        };

        const handleRemoveCase = (caseIndex: number) => {
          setSubtask({
            ...subtask,
            cases: subtask.cases.filter((_, i) => i !== caseIndex),
          });
        };
        const handleAddCase = () => {
          setSubtask({
            ...subtask,
            cases: [...subtask.cases, { input: "", output: "" }],
          });
        };

        return (
          <div
            className="collapse collapse-open overflow-visible"
            key={index}
            tabIndex={0}
          >
            <div className="collapse-title flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <span>子任务 {index + 1}</span>
                <div className="tooltip" data-tip="分值">
                  <input
                    className="input input-bordered input-sm w-24"
                    type="number"
                    value={subtask.score}
                    onChange={(event) => {
                      setSubtask({
                        ...subtask,
                        score: Number(event.target.value),
                      });
                    }}
                  />
                </div>
              </span>
              <span className="inline-flex items-center gap-2">
                {/* 添加新的测试点 */}
                <div className="tooltip" data-tip="新建测试点">
                  <button
                    className="btn btn-square btn-success btn-ghost btn-sm"
                    onClick={handleAddCase}
                  >
                    <HiOutlinePlus className="text-success" />
                  </button>
                </div>
                {/* 删除当前子任务 */}
                <div className="tooltip" data-tip="删除子任务">
                  <button
                    className="btn btn-square btn-error btn-ghost btn-sm"
                    onClick={handleRemoveSubtask}
                  >
                    <HiOutlineX className="text-error" />
                  </button>
                </div>
              </span>
            </div>
            <div className="collapse-content overflow-visible">
              {subtask.cases.map((task, index) => {
                const setTask = (task: ConfigTaskDefault) => {
                  setSubtask({
                    ...subtask,
                    cases: [
                      ...subtask.cases.slice(0, index),
                      task,
                      ...subtask.cases.slice(index + 1),
                    ],
                  });
                };

                return (
                  <div className="flex items-center gap-2" key={index}>
                    <span>测试点 {index + 1}</span>
                    <HiOutlineChevronLeft />
                    <div className="tooltip" data-tip="输入文件">
                      <DataSelect
                        className="select select-bordered select-sm"
                        value={task.input}
                        options={props.data}
                        onChange={(event) => {
                          setTask({ ...task, input: event.target.value });
                        }}
                      />
                    </div>
                    <HiOutlineChevronRight />
                    <div className="tooltip" data-tip="输出文件">
                      <DataSelect
                        className="select tooltip select-bordered select-sm"
                        value={task.output}
                        options={props.data}
                        onChange={(event) => {
                          setTask({ ...task, output: event.target.value });
                        }}
                      />
                    </div>
                    {/* 删除当前测试点 */}
                    <div className="tooltip" data-tip="删除测试点">
                      <button className="btn btn-square btn-error btn-ghost btn-sm">
                        <HiOutlineX
                          className="cursor-pointer text-error"
                          onClick={() => handleRemoveCase(index)}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="my-4 flex flex-col gap-2">
        {!props.config.value.subtasks.length && (
          <div className="alert alert-warning">还没有任何子任务</div>
        )}
        {props.config.value.subtasks.length > 0 &&
          diagnostics.value.hasInvalidScore && (
            <div className="alert alert-warning">子任务分数之和不等于 100</div>
          )}
        {diagnostics.value.hasEmptySubtask && (
          <div className="alert alert-warning">存在空的子任务</div>
        )}
        {diagnostics.value.hasEmptyTask && (
          <div className="alert alert-warning">存在未选择的测试点</div>
        )}
        {diagnostics.value.hasDuplicatedFile && (
          <div className="alert alert-warning">存在重复使用的测试数据</div>
        )}
      </div>
    </>
  );
}

type InteractiveConfig = Extract<ConfigJson, { type: "interactive" }>;
type InteractiveConfigEditorProps = EditorProps<InteractiveConfig>;

function InteractiveConfigEditor(props: InteractiveConfigEditorProps) {
  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">交互代码</span>
        </label>
        <DataSelect
          options={props.data}
          value={props.config.value.interactive}
          onChange={(event) => {
            props.config.value = {
              ...props.config.value,
              interactive: event.target.value,
            };
          }}
        />
      </div>

      <div className="my-4 flex flex-col gap-2">
        {!props.config.value.interactive && (
          <div className="alert alert-warning">请选择交互代码</div>
        )}
      </div>
    </>
  );
}

type DynamicConfig = Extract<ConfigJson, { type: "dynamic" }>;
type DynamicConfigEditorProps = EditorProps<DynamicConfig>;

function DynamicConfigEditor(props: DynamicConfigEditorProps) {
  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">数据构造代码 (mkdata.cpp)</span>
        </label>
        <DataSelect
          options={props.data}
          value={props.config.value.mkdata}
          onChange={(event) => {
            props.config.value = {
              ...props.config.value,
              mkdata: event.target.value,
            };
          }}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">标准代码 (std.cpp)</span>
        </label>
        <DataSelect
          options={props.data}
          value={props.config.value.std}
          onChange={(event) => {
            props.config.value = {
              ...props.config.value,
              std: event.target.value,
            };
          }}
        />
      </div>

      <div className="my-4 flex flex-col gap-2">
        {(!props.config.value.mkdata || !props.config.value.std) && (
          <div className="alert alert-warning">
            请选择数据构造代码和标准代码
          </div>
        )}
        <div className="alert alert-warning">TODO 我还没写完，你先别急</div>
      </div>
    </>
  );
}

type SubmitAnswerConfig = Extract<ConfigJson, { type: "submit_answer" }>;
type SubmitAnswerConfigEditorProps = EditorProps<SubmitAnswerConfig>;

function SubmitAnswerConfigEditor(props: SubmitAnswerConfigEditorProps) {
  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">答案</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          value={props.config.value.answer}
          onChange={(event) => {
            props.config.value = {
              ...props.config.value,
              answer: event.target.value,
            };
          }}
        />
      </div>

      <div className="my-4 flex flex-col gap-2">
        {!props.config.value.answer && (
          <div className="alert alert-warning">请输入答案</div>
        )}
      </div>
    </>
  );
}

type ConfigJSONEditorProps = {
  config: ConfigJson;
  data: string[];
};

function ConfigJSONEditor({
  config: defaultConfig,
  data,
}: ConfigJSONEditorProps) {
  const config = useSignal(defaultConfig);
  const fetcher = useSignalFetcher();
  const Toasts = useToasts();

  useEffect(() => {
    if (fetcher.actionSuccess) {
      Toasts.success("更新配置成功");
    }
  }, [fetcher.actionSuccess]);

  return (
    <div className="mb-24 flex flex-col gap-2">
      <div className="form-control">
        <label className="label">
          <span className="label-text">评测方式</span>
        </label>
        <select
          className="select select-bordered w-full max-w-xs"
          value={config.value.type}
          onChange={(event) => {
            const value = event.target.value as ConfigJson["type"];
            if (value === "default")
              config.value = { type: "default", subtasks: [] };
            else if (value === "interactive")
              config.value = { type: "interactive", interactive: "" };
            else if (value === "dynamic")
              config.value = {
                type: "dynamic",
                mkdata: "",
                std: "",
                subtasks: [],
              };
            else config.value = { type: "submit_answer", answer: "" };
          }}
        >
          <option value="default">默认</option>
          <option value="interactive">交互</option>
          <option value="dynamic">动态</option>
          <option value="submit_answer">提答</option>
        </select>
      </div>

      {config.value.type === "default" && (
        <DefaultConfigEditor
          data={data}
          config={config as Signal<DefaultConfig>}
        />
      )}
      {config.value.type === "interactive" && (
        <InteractiveConfigEditor
          data={data}
          config={config as Signal<InteractiveConfig>}
        />
      )}
      {config.value.type === "dynamic" && (
        <DynamicConfigEditor
          data={data}
          config={config as Signal<DynamicConfig>}
        />
      )}
      {config.value.type === "submit_answer" && (
        <SubmitAnswerConfigEditor
          data={data}
          config={config as Signal<SubmitAnswerConfig>}
        />
      )}

      <fetcher.Form method="post" encType="multipart/form-data">
        <textarea
          name="config"
          value={JSON.stringify(config.value)}
          hidden
          readOnly
        />
        <button
          className="btn btn-primary w-full"
          type="submit"
          name="_action"
          value={ActionType.UpdateConfig}
          disabled={fetcher.isRunning}
        >
          确认更新
        </button>
        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            查看生成 JSON 文件
          </div>
          <div className="collapse-content">
            <Highlighter language="json">
              {JSON.stringify(config.value, null, 2)}
            </Highlighter>
          </div>
        </div>
      </fetcher.Form>
    </div>
  );
}

export default function ProblemData() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const files = useComputed(() => loaderData.value.problem.files);
  const data = useComputed(() => loaderData.value.problem.data);
  const config = useComputed(() => loaderData.value.config);

  const defaultConfig = useComputed<ConfigJson>(() =>
    config.value ? JSON.parse(config.value) : { type: "default", subtasks: [] }
  );

  const dataWithoutConfig = useComputed(() =>
    data.value.filter(({ filename }) => filename !== "config.json")
  );
  const visible = useSignal(false);

  return (
    <>
      {!config.value && (
        <div className="alert alert-warning">
          您还没有进行题目的评测配置，题目当前无法被评测
        </div>
      )}

      <h2 className="flex items-center justify-between">
        <span>测试数据</span>
        <span className="inline-flex items-center gap-4">
          <button
            className="btn btn-primary gap-2"
            onClick={() => (visible.value = true)}
          >
            <span>配置</span>
            <HiOutlineArrowsExpand />
          </button>
          <FileUploader uploadAction={ActionType.UploadData} />
        </span>
      </h2>
      <p>用于评测的数据文件。</p>
      <p>
        关于评测的配置文件 <code>config.json</code>
        ，您可以选择使用我们提供的在线编辑工具，也可以选择手动编辑好后上传。
      </p>
      <FileList
        files={dataWithoutConfig.value}
        deleteAction={ActionType.RemoveData}
      />

      <h2 className="flex items-center justify-between">
        <span>附加文件</span>
        <FileUploader uploadAction={ActionType.UploadFile} />
      </h2>
      <p>题目的附加资料，例如样例数据、PDF 题面等</p>
      <FileList files={files.value} deleteAction={ActionType.RemoveFile} />

      <Fullscreen visible={visible.value} className="overflow-auto bg-base-100">
        <div className="mx-auto w-full max-w-xl p-4">
          <button
            className="btn btn-ghost gap-2"
            onClick={() => (visible.value = false)}
          >
            <HiOutlineChevronLeft />
            <span>返回</span>
          </button>

          <h2>配置评测信息</h2>

          <ConfigJSONEditor
            config={defaultConfig.value}
            data={dataWithoutConfig.value.map(({ filename }) => filename)}
          />
        </div>
      </Fullscreen>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

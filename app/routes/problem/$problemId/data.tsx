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
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineX,
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
  config: T;
  onChange: (config: T) => void;
  data: string[];
};
type DefaultConfig = Extract<ConfigJson, { type: "default" }>;
type DefaultConfigEditorProps = EditorProps<DefaultConfig>;

function DefaultConfigEditor(props: DefaultConfigEditorProps) {
  const handleAddSubtask = () => {
    props.onChange({
      ...props.config,
      subtasks: [...props.config.subtasks, { score: 20, cases: [] }],
    });
  };

  const totalScore = props.config.subtasks.reduce(
    (prev, cur) => prev + cur.score,
    0
  );
  const hasEmptySubtask = props.config.subtasks.some(
    (subtask) => subtask.cases.length === 0
  );
  const hasEmptyTask = props.config.subtasks.some((subtask) =>
    subtask.cases.some((task) => task.input === "" || task.output === "")
  );
  const hasInvalidScore = totalScore !== 100;
  const allFiles = props.config.subtasks
    .flatMap((subtask) =>
      subtask.cases.flatMap((task) => [task.input, task.output])
    )
    .filter((file) => file !== "");
  const hasDuplicatedFile = new Set(allFiles).size !== allFiles.length;

  return (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">时间限制 (ms)</span>
        </label>
        <input
          className="input input-bordered"
          type="number"
          value={props.config.time}
          onChange={(event) => {
            props.onChange({
              ...props.config,
              time: Number(event.target.value),
            });
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
          value={props.config.memory}
          onChange={(event) => {
            props.onChange({
              ...props.config,
              memory: Number(event.target.value),
            });
          }}
          placeholder={DEFAULT_MEMORY_LIMIT.toString()}
        />
      </div>

      <h3 className="flex justify-between items-center">
        <span>子任务配置</span>
        <button className="btn btn-primary gap-2" onClick={handleAddSubtask}>
          <HiOutlinePlus />
          <span>添加子任务</span>
        </button>
      </h3>

      {props.config.subtasks.map((subtask, index) => {
        const setSubtask = (subtask: ConfigSubtask<ConfigTaskDefault>) => {
          props.onChange({
            ...props.config,
            subtasks: [
              ...props.config.subtasks.slice(0, index),
              subtask,
              ...props.config.subtasks.slice(index + 1),
            ],
          });
        };
        const handleRemoveSubtask = () => {
          props.onChange({
            ...props.config,
            subtasks: [
              ...props.config.subtasks.slice(0, index),
              ...props.config.subtasks.slice(index + 1),
            ],
          });
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
            <div className="collapse-title flex justify-between items-center">
              <span className="inline-flex gap-2 items-center">
                <span>子任务 {index + 1}</span>
                <div className="tooltip" data-tip="分值">
                  <input
                    className="input input-bordered input-sm w-12"
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
              <span className="inline-flex gap-2 items-center">
                {/* 添加新的测试点 */}
                <div className="tooltip" data-tip="新建测试点">
                  <button
                    className="btn btn-ghost btn-success btn-square btn-sm"
                    onClick={handleAddCase}
                  >
                    <HiOutlinePlus className="text-success" />
                  </button>
                </div>
                {/* 删除当前子任务 */}
                <div className="tooltip" data-tip="删除子任务">
                  <button
                    className="btn btn-ghost btn-error btn-square btn-sm"
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
                  <div className="flex gap-2 items-center" key={index}>
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
                        className="select select-bordered select-sm tooltip"
                        value={task.output}
                        options={props.data}
                        onChange={(event) => {
                          setTask({ ...task, output: event.target.value });
                        }}
                      />
                    </div>
                    {/* 删除当前测试点 */}
                    <div className="tooltip" data-tip="删除测试点">
                      <button className="btn btn-ghost btn-error btn-square btn-sm">
                        <HiOutlineX
                          className="text-error cursor-pointer"
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

      <div className="flex flex-col gap-2 my-4">
        {!props.config.subtasks.length && (
          <div className="alert alert-warning">还没有任何子任务</div>
        )}
        {!!props.config.subtasks.length && hasInvalidScore && (
          <div className="alert alert-warning">子任务分数之和不等于 100</div>
        )}
        {hasEmptySubtask && (
          <div className="alert alert-warning">存在空的子任务</div>
        )}
        {hasEmptyTask && (
          <div className="alert alert-warning">存在未选择的测试点</div>
        )}
        {hasDuplicatedFile && (
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
          value={props.config.interactive}
          onChange={(event) => {
            props.onChange({
              ...props.config,
              interactive: event.target.value,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-2 my-4">
        {!props.config.interactive && (
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
          value={props.config.mkdata}
          onChange={(event) => {
            props.onChange({
              ...props.config,
              mkdata: event.target.value,
            });
          }}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">标准代码 (std.cpp)</span>
        </label>
        <DataSelect
          options={props.data}
          value={props.config.std}
          onChange={(event) => {
            props.onChange({
              ...props.config,
              std: event.target.value,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-2 my-4">
        {(!props.config.mkdata || !props.config.std) && (
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
          value={props.config.answer}
          onChange={(event) => {
            props.onChange({
              ...props.config,
              answer: event.target.value,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-2 my-4">
        {!props.config.answer && (
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
        <DefaultConfigEditor data={data} config={config} onChange={setConfig} />
      )}
      {config.type === "interactive" && (
        <InteractiveConfigEditor
          data={data}
          config={config}
          onChange={setConfig}
        />
      )}
      {config.type === "dynamic" && (
        <DynamicConfigEditor data={data} config={config} onChange={setConfig} />
      )}
      {config.type === "submit_answer" && (
        <SubmitAnswerConfigEditor
          data={data}
          config={config}
          onChange={setConfig}
        />
      )}

      <button
        className="btn btn-primary"
        onClick={() => alert("我还没写完，你先别急")}
      >
        确认更新
      </button>
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
      {!rawConfig && (
        <div className="alert alert-warning">
          您还没有进行题目的评测配置，题目当前无法被评测
        </div>
      )}

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

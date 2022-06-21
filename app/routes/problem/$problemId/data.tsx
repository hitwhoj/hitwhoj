import type { File as ProblemFile, Problem } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import {
  createProblemData,
  createProblemFile,
  removeFile,
} from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import { Table, Button, Space } from "@arco-design/web-react";
import { IconDelete, IconUpload } from "@arco-design/web-react/icon";
import type { ColumnProps } from "@arco-design/web-react/es/Table";
import { useEffect, useRef } from "react";
import { checkProblemUpdatePermission } from "~/utils/permission/problem";

type LoaderData = {
  problem: Pick<Problem, "title"> & {
    files: ProblemFile[];
    data: ProblemFile[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  params,
  request,
}) => {
  const problemId = invariant(idScheme, params.problemId, {
    status: 404,
  });

  await checkProblemUpdatePermission(request, problemId);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      title: true,
      files: {
        orderBy: {
          filename: "asc",
        },
      },
      data: {
        orderBy: {
          filename: "asc",
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return { problem };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `编辑数据: ${data?.problem.title} - HITwh OJ`,
});

enum ActionType {
  UploadData = "uploadData",
  UploadFile = "uploadFile",
  RemoveData = "removeData",
  RemoveFile = "removeFile",
}

export const action: ActionFunction = async ({ request, params }) => {
  const problemId = invariant(idScheme, params.problemId, {
    status: 404,
  });

  await checkProblemUpdatePermission(request, problemId);

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
};

function ProblemFileUploader({
  action,
  uploadText,
}: {
  action: ActionType;
  uploadText: string;
}) {
  const fetcher = useFetcher();
  const isUploading = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUploading) {
      formRef.current?.reset();
    }
  }, [isUploading]);

  return (
    <fetcher.Form method="post" encType="multipart/form-data" ref={formRef}>
      <input
        type="file"
        name="file"
        multiple
        hidden
        ref={inputRef}
        onInput={() => fetcher.submit(formRef.current)}
      />
      <input type="hidden" name="_action" value={action} />
      <Button
        type="primary"
        icon={<IconUpload />}
        onClick={() => inputRef.current?.click()}
        loading={isUploading}
      >
        {uploadText}
      </Button>
    </fetcher.Form>
  );
}

function ProblemFileRemoveButton({ file }: { file: ProblemFile }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="hidden" name="fid" value={file.id} />
      <Button
        type="text"
        status="danger"
        htmlType="submit"
        name="_action"
        value={ActionType.RemoveFile}
        loading={isDeleting}
        icon={<IconDelete />}
        size="mini"
      />
    </fetcher.Form>
  );
}

const columns: ColumnProps<ProblemFile>[] = [
  {
    title: "文件名",
    dataIndex: "filename",
    render: (_, file) => (
      <Link to={`/file/${file.id}`} target="_blank">
        {file.filename}
      </Link>
    ),
  },
  {
    title: "文件大小",
    dataIndex: "filesize",
  },
  {
    title: "文件类型",
    dataIndex: "mimetype",
    filters: [
      { text: "图片", value: "image" },
      { text: "文档", value: "text" },
      { text: "音频", value: "audio" },
      { text: "视频", value: "video" },
    ],
    onFilter: (value: string, file: ProblemFile) =>
      file.mimetype.startsWith(value),
  },
  {
    title: "操作",
    dataIndex: "action",
    render: (_, file) => <ProblemFileRemoveButton file={file} />,
  },
];

function ProblemFileList({ files }: { files: ProblemFile[] }) {
  return (
    <Table
      rowKey="id"
      columns={columns}
      data={files}
      pagination={false}
      size="small"
    />
  );
}

export default function ProblemData() {
  const {
    problem: { files, data },
  } = useLoaderData<LoaderData>();

  return (
    <div className="problem-data-grid">
      <div>
        <h2>测试数据</h2>
        <p>用于评测的数据文件</p>
      </div>

      <div>
        <Space direction="vertical" size="medium" style={{ display: "flex" }}>
          <ProblemFileUploader
            action={ActionType.UploadData}
            uploadText="上传数据捏"
          />
          <ProblemFileList files={data} />
        </Space>
      </div>

      <div>
        <h2>附加文件</h2>
        <p>题目的附加资料，例如样例数据、PDF 题面等</p>
      </div>

      <div>
        <Space direction="vertical" size="medium" style={{ display: "flex" }}>
          <ProblemFileUploader
            action={ActionType.UploadFile}
            uploadText="上传文件捏"
          />
          <ProblemFileList files={files} />
        </Space>
      </div>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

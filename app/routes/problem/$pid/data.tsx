import type { File as ProblemFile, Problem } from "@prisma/client";

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, unstable_parseMultipartFormData } from "@remix-run/node";

import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { createProblemFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";
import { Table, Button, Space } from "@arco-design/web-react";
import { IconDelete, IconUpload } from "@arco-design/web-react/icon";
import type { ColumnProps } from "@arco-design/web-react/es/Table";
import { useEffect, useRef } from "react";

type LoaderData = {
  problem: Pick<Problem, "title"> & {
    files: ProblemFile[];
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  // 检查是否有文件操作的权限
  // TODO: 好像有点复杂
  await guaranteePermission(
    request,
    Permissions.Problem.Data.View | Permissions.Problem.File.View,
    { pid }
  );

  const problem = await db.problem.findUnique({
    where: { pid },
    select: {
      title: true,
      files: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `编辑数据: ${data?.problem.title} - HITwh OJ`,
});

enum ActionType {
  UploadData = "uploadData",
  UploadFile = "uploadFile",
  RemoveData = "removeData",
  RemoveFile = "removeFile",
}

export const action: ActionFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

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

      // 检查权限
      await guaranteePermission(
        request,
        _action === ActionType.UploadData
          ? Permissions.Problem.Data.Create
          : Permissions.Problem.File.Create,
        { pid }
      );

      // 保存文件
      await Promise.all(
        files.map((file) => {
          return createProblemFile(
            file,
            pid,
            _action === ActionType.UploadData
          );
        })
      );

      return null;
    }

    case ActionType.RemoveData:
    case ActionType.RemoveFile: {
      const fid = invariant(uuidScheme.safeParse(form.get("fid")));

      // 检查权限
      await guaranteePermission(
        request,
        _action === ActionType.RemoveData
          ? Permissions.Problem.Data.Delete
          : Permissions.Problem.File.Delete,
        { pid }
      );

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
  const isUploading = fetcher.state === "submitting";
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
        style={{ display: "none" }}
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
  const isDeleting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="fid" value={file.fid} />
      <Button
        type="primary"
        status="danger"
        htmlType="submit"
        name="_action"
        value={ActionType.RemoveFile}
        loading={isDeleting}
        icon={<IconDelete />}
        size="small"
      />
    </fetcher.Form>
  );
}

const columns: ColumnProps<ProblemFile>[] = [
  {
    title: "文件名",
    dataIndex: "filename",
    sorter: (a, b) =>
      a.filename > b.filename ? 1 : a.filename < b.filename ? -1 : 0,
    render: (_, file) => (
      <Link to={`/file/${file.fid}`} target="_blank" rel="noreferrer noopener">
        {file.filename}
      </Link>
    ),
  },
  {
    title: "文件大小",
    dataIndex: "filesize",
    sorter: (a, b) => a.filesize - b.filesize,
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
  return <Table rowKey="fid" columns={columns} data={files} />;
}

export default function ProblemData() {
  const {
    problem: { files },
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
          <ProblemFileList files={files.filter((file) => file.private)} />
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
          <ProblemFileList files={files.filter((file) => !file.private)} />
        </Space>
      </div>
    </div>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

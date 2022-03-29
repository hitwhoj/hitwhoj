import type { File as ProblemFile } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  unstable_parseMultipartFormData,
  useFetcher,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { createProblemFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";
import { Table, Button, Space } from "@arco-design/web-react";
import { IconDelete, IconUpload } from "@arco-design/web-react/icon";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import { useRef } from "react";

type LoaderData = {
  files: ProblemFile[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const problem = await db.problem.findUnique({
    where: { pid },
    select: {
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

  return json({ files: problem.files });
};

enum ActionType {
  UploadData = "uploadData",
  UploadFile = "uploadFile",
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

    case ActionType.RemoveFile: {
      const fid = invariant(uuidScheme.safeParse(form.get("fid")));

      await removeFile(fid);

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

function ProblemFileUploader({ action }: { action: ActionType }) {
  const fetcher = useFetcher();
  const isUploading = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        上传文件捏
      </Button>
    </fetcher.Form>
  );
}

function ProblemFileRemoveButton({ file }: { file: ProblemFile }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

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
  const { files } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>测试数据</h2>
      <p>用于评测的数据文件</p>
      <Space direction="vertical" size="medium" style={{ display: "flex" }}>
        <ProblemFileUploader action={ActionType.UploadData} />
        <ProblemFileList files={files.filter((file) => file.private)} />
      </Space>

      <h2>附加文件</h2>
      <p>题目的附加资料，例如样例数据、PDF 题面等</p>
      <Space direction="vertical" size="medium" style={{ display: "flex" }}>
        <ProblemFileUploader action={ActionType.UploadFile} />
        <ProblemFileList files={files.filter((file) => !file.private)} />
      </Space>
    </>
  );
}

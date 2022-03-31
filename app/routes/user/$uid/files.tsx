import { Button, Space, Switch, Table } from "@arco-design/web-react";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import { IconDelete, IconUpload } from "@arco-design/web-react/icon";
import { File as UserFile, User } from "@prisma/client";
import { useEffect, useRef } from "react";
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  MetaFunction,
  unstable_parseMultipartFormData,
  useFetcher,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { createUserFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";

type LoaderData = {
  user: Pick<User, "nickname" | "username"> & {
    createdFiles: UserFile[];
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  await guaranteePermission(request, Permissions.User.File.View, { uid });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      username: true,
      nickname: true,
      createdFiles: {
        orderBy: [{ createdAt: "desc" }, { filename: "asc" }],
      },
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `用户文件: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

enum ActionType {
  UploadFile = "uploadFile",
  RemoveFile = "removeFile",
  ModifyPrivacy = "modifyPrivacy",
}

export const action: ActionFunction = async ({ request, params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UploadFile: {
      await guaranteePermission(request, Permissions.User.File.Create, { uid });

      const files = form
        .getAll("file")
        .filter((file): file is File => file instanceof File);

      if (!files.length) {
        throw new Response("No file found", { status: 400 });
      }

      await Promise.all(files.map((file) => createUserFile(file, uid)));

      return null;
    }

    case ActionType.RemoveFile: {
      await guaranteePermission(request, Permissions.User.File.Delete, { uid });

      const fid = invariant(uuidScheme.safeParse(form.get("fid")));

      await removeFile(fid);

      return null;
    }

    case ActionType.ModifyPrivacy: {
      await guaranteePermission(request, Permissions.User.File.Update, { uid });

      const fid = invariant(uuidScheme.safeParse(form.get("fid")));

      const file = await db.file.findUnique({
        where: { fid },
        select: { private: true },
      });

      if (!file) {
        throw new Response("File not found", { status: 404 });
      }

      await db.file.update({
        where: { fid },
        data: { private: !file.private },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

function UserFileUploader() {
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
      <input type="hidden" name="_action" value={ActionType.UploadFile} />
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

function UserFilePrivacyModifier({ file }: { file: UserFile }) {
  const fetcher = useFetcher();
  const isFetching = fetcher.state === "submitting";
  const ref = useRef<HTMLFormElement>(null);

  return (
    <fetcher.Form method="post" ref={ref}>
      <input type="hidden" name="fid" value={file.fid} />
      <input type="hidden" name="_action" value={ActionType.ModifyPrivacy} />
      <Switch
        defaultChecked={!file.private}
        onChange={() => fetcher.submit(ref.current)}
        loading={isFetching}
      />
    </fetcher.Form>
  );
}

function UserFileRemoveButton({ file }: { file: UserFile }) {
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
      />
    </fetcher.Form>
  );
}

const columns: ColumnProps<UserFile>[] = [
  {
    title: "文件名",
    dataIndex: "filename",
    sorter: (a: UserFile, b: UserFile) =>
      a.filename > b.filename ? 1 : a.filename < b.filename ? -1 : 0,
    render: (_, file) => (
      <Link to={`/file/${file.fid}`} target="_blank" rel="noopener noreferrer">
        {file.filename}
      </Link>
    ),
  },
  {
    title: "文件大小",
    dataIndex: "filesize",
    sorter: (a: UserFile, b: UserFile) => a.filesize - b.filesize,
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
    onFilter: (value: string, file: UserFile) =>
      file.mimetype.startsWith(value),
  },
  {
    title: "公开",
    dataIndex: "private",
    align: "center",
    render: (_, file) => <UserFilePrivacyModifier file={file} />,
  },
  {
    title: "操作",
    dataIndex: "action",
    render: (_, file) => <UserFileRemoveButton file={file} />,
  },
];

function UserFileList({ files }: { files: UserFile[] }) {
  return (
    <Table rowKey="fid" columns={columns} data={files} pagination={false} />
  );
}

export default function UserFiles() {
  const {
    user: { createdFiles: files },
  } = useLoaderData<LoaderData>();

  return (
    <>
      <div>
        <h2>用户文件</h2>
        <p>上传即代表同意我们的用户手册（虽然没有这个东西）</p>
      </div>
      <Space direction="vertical" size="medium" style={{ display: "flex" }}>
        <UserFileUploader />
        <UserFileList files={files} />
      </Space>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

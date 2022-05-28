import { Button, Space, Table } from "@arco-design/web-react";
import type { ColumnProps } from "@arco-design/web-react/es/Table";
import { IconDelete, IconUpload } from "@arco-design/web-react/icon";
import type { File as UserFile, User } from "@prisma/client";
import { useEffect, useRef } from "react";

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";

import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { createUserFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import { checkUserWritePermission } from "~/utils/permission/user";

type LoaderData = {
  user: Pick<User, "nickname" | "username"> & {
    createdFiles: UserFile[];
  };
};

export const loader: LoaderFunction<LoaderData> = async ({
  request,
  params,
}) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  await checkUserWritePermission(request, userId);

  const user = await db.user.findUnique({
    where: { id: userId },
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

  return { user };
};

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `用户文件: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

enum ActionType {
  UploadFile = "uploadFile",
  RemoveFile = "removeFile",
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  await checkUserWritePermission(request, userId);

  const form = await unstable_parseMultipartFormData(request, handler);
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UploadFile: {
      const files = form
        .getAll("file")
        .filter((file): file is File => file instanceof File);

      if (!files.length) {
        throw json(["File missing"], { status: 400 });
      }

      await Promise.all(files.map((file) => createUserFile(file, userId)));

      return null;
    }

    case ActionType.RemoveFile: {
      const fid = invariant(uuidScheme, form.get("fid"));

      const file = await db.file.findUnique({
        where: { id: fid },
        select: { userId: true },
      });

      // 检查是否是用户的文件
      if (!file || file.userId !== userId) {
        throw new Response(null, { status: 404 });
      }

      await removeFile(fid);

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

function UserFileRemoveButton({ file }: { file: UserFile }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="fid" value={file.id} />
      <Button
        type="text"
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

function UserFileList({ files }: { files: UserFile[] }) {
  const columns: ColumnProps<UserFile>[] = [
    {
      title: "文件名",
      dataIndex: "filename",
      sorter: (a: UserFile, b: UserFile) =>
        a.filename > b.filename ? 1 : a.filename < b.filename ? -1 : 0,
      render: (_, file) => (
        <Link to={`/file/${file.id}`} target="_blank">
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
      title: "操作",
      dataIndex: "action",
      render: (_, file) => <UserFileRemoveButton file={file} />,
    },
  ];

  return (
    <Table rowKey="fid" columns={columns} data={files} pagination={false} />
  );
}

export default function UserFilePage() {
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

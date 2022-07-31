import { Button, Typography } from "@arco-design/web-react";
import { IconDelete, IconUpload } from "@arco-design/web-react/icon";
import type { File as UserFile, User } from "@prisma/client";
import { useEffect, useRef } from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { createUserFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import { TableList } from "~/src/TableList";
import { permissionUserProfileWrite } from "~/utils/permission/user";
import { assertPermission } from "~/utils/permission";

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
  await assertPermission(permissionUserProfileWrite, request, userId);

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
  await assertPermission(permissionUserProfileWrite, request, userId);

  const form = await unstable_parseMultipartFormData(request, handler);
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UploadFile: {
      const files = form
        .getAll("file")
        .filter((file): file is File => file instanceof File);

      if (!files.length) {
        throw new Response("File missing", { status: 400 });
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
        throw new Response("File not found", { status: 404 });
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
        hidden
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
        type="primary"
        status="danger"
        htmlType="submit"
        name="_action"
        size="mini"
        value={ActionType.RemoveFile}
        loading={isDeleting}
        icon={<IconDelete />}
      />
    </fetcher.Form>
  );
}

function UserFileList({ files }: { files: UserFile[] }) {
  return (
    <TableList
      data={files}
      columns={[
        {
          title: "文件名",
          render: ({ id, filename }) => (
            <Link to={`/file/${id}`} target="_blank">
              {filename}
            </Link>
          ),
          sorter: (a, b) =>
            a.filename > b.filename ? 1 : a.filename < b.filename ? -1 : 0,
        },
        {
          title: "文件类型",
          render: ({ mimetype }) => mimetype,
          align: "center",
          minimize: true,
        },
        {
          title: "文件大小",
          render: ({ filesize }) => `${filesize} bytes`,
          align: "center",
          minimize: true,
          sorter: (a, b) =>
            a.filesize > b.filesize ? 1 : a.filesize < b.filesize ? -1 : 0,
        },
        {
          title: "操作",
          render: (file) => <UserFileRemoveButton file={file} />,
          align: "center",
          minimize: true,
        },
      ]}
    />
  );
}

export default function UserFilePage() {
  const {
    user: { createdFiles: files },
  } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={4}>用户文件</Typography.Title>
      <Typography.Paragraph>
        上传即代表同意我们的用户手册（虽然没有这个东西）
      </Typography.Paragraph>
      <Typography.Paragraph>
        <UserFileUploader />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <UserFileList files={files} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import { Button, Switch, Table } from "@arco-design/web-react";
import { ColumnProps } from "@arco-design/web-react/es/Table";
import { IconDelete } from "@arco-design/web-react/icon";
import { File as UserFile } from "@prisma/client";
import { useRef } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  unstable_parseMultipartFormData,
  useFetcher,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { createUserFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";

type LoaderData = {
  files: UserFile[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      createdFiles: {
        orderBy: [{ createdAt: "desc" }, { filename: "asc" }],
      },
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ files: user.createdFiles });
};

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
      const fid = invariant(uuidScheme.safeParse(form.get("fid")), {
        status: 400,
      });

      await removeFile(fid);

      return null;
    }

    case ActionType.ModifyPrivacy: {
      const fid = invariant(uuidScheme.safeParse(form.get("fid")), {
        status: 400,
      });

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

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="file" name="file" multiple />
      <button type="submit" name="_action" value={ActionType.UploadFile}>
        上传捏
      </button>
    </fetcher.Form>
  );
}

function UserFilePrivacyModifier({ file }: { file: UserFile }) {
  const fetcher = useFetcher();
  const isFetching = fetcher.state !== "idle";
  const ref = useRef<HTMLFormElement>(null);

  return (
    <fetcher.Form method="post" ref={ref}>
      <input type="hidden" name="fid" value={file.fid} />
      <input type="hidden" name="_action" value={ActionType.ModifyPrivacy} />
      <Switch
        disabled={isFetching}
        defaultChecked={!file.private}
        onChange={() => fetcher.submit(ref.current)}
      />
    </fetcher.Form>
  );
}

function UserFileRemoveButton({ file }: { file: UserFile }) {
  const fetcher = useFetcher();
  const isFetching = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="fid" value={file.fid} />
      <Button
        type="primary"
        status="danger"
        htmlType="submit"
        name="_action"
        value={ActionType.RemoveFile}
        disabled={isFetching}
        icon={<IconDelete />}
      />
    </fetcher.Form>
  );
}

const columns: ColumnProps<UserFile>[] = [
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
  },
  {
    title: "公开状态",
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
  return <Table rowKey="fid" columns={columns} data={files} />;
}

export default function UserFiles() {
  const { files } = useLoaderData<LoaderData>();

  return (
    <>
      <UserFileUploader />
      <UserFileList files={files} />
    </>
  );
}

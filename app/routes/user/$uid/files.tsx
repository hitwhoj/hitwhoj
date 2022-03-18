import { File as UserFile } from "@prisma/client";
import {
  ActionFunction,
  json,
  Link,
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
        orderBy: {
          createdAt: "desc",
        },
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

function UserFileListItem({ file }: { file: UserFile }) {
  const fetcher = useFetcher();
  const isFetching = fetcher.state !== "idle";

  return (
    <tr style={{ opacity: isFetching ? 0.5 : 1 }}>
      <td>
        <Link to={`/file/${file.fid}`}>{file.filename}</Link>
      </td>
      <td>{file.filesize}</td>
      <td>{file.mimetype}</td>
      <td>
        {file.private ? (
          <span style={{ color: "red" }}>隐藏</span>
        ) : (
          <span style={{ color: "lime" }}>公开</span>
        )}
      </td>
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="fid" value={file.fid} />
          <button
            type="submit"
            name="_action"
            value={ActionType.RemoveFile}
            disabled={isFetching}
          >
            删除捏
          </button>
          <button
            type="submit"
            name="_action"
            value={ActionType.ModifyPrivacy}
            disabled={isFetching}
          >
            {file.private ? "公开" : "隐藏"}
          </button>
        </fetcher.Form>
      </td>
    </tr>
  );
}

function UserFileList({ files }: { files: UserFile[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>文件名</th>
          <th>文件大小</th>
          <th>文件类型</th>
          <th>公开状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <UserFileListItem file={file} key={file.fid} />
        ))}
      </tbody>
    </table>
  );
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

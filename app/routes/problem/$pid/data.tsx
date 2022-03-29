import type { File as ProblemFile } from "@prisma/client";
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
import { createProblemFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";

type LoaderData = {
  files: ProblemFile[];
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

function ProblemFileUploader({ action }: { action: ActionType }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="file" name="file" multiple />
      <button type="submit" name="_action" value={action}>
        上传捏
      </button>
    </fetcher.Form>
  );
}

function ProblemFileListItem({
  file,
  action,
}: {
  file: ProblemFile;
  action: ActionType;
}) {
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
        <fetcher.Form method="post">
          <input type="hidden" name="fid" value={file.fid} />
          <button
            type="submit"
            name="_action"
            value={action}
            disabled={isFetching}
          >
            删除捏
          </button>
        </fetcher.Form>
      </td>
    </tr>
  );
}

function ProblemFileList({
  files,
  action,
}: {
  files: ProblemFile[];
  action: ActionType;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>文件名</th>
          <th>文件大小</th>
          <th>文件类型</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <ProblemFileListItem file={file} key={file.fid} action={action} />
        ))}
      </tbody>
    </table>
  );
}

export default function ProblemData() {
  const { files } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>测试数据</h2>
      <p>用于评测的数据文件</p>
      <ProblemFileUploader action={ActionType.UploadData} />
      <ProblemFileList
        files={files.filter((file) => file.private)}
        action={ActionType.RemoveData}
      />

      <h2>附加文件</h2>
      <p>题目的附加资料，例如样例数据、PDF 题面等</p>
      <ProblemFileUploader action={ActionType.UploadFile} />
      <ProblemFileList
        files={files.filter((file) => !file.private)}
        action={ActionType.RemoveFile}
      />
    </>
  );
}

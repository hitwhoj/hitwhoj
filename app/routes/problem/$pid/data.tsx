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
import { invariant } from "~/utils/invariant";
import { s3 } from "~/utils/s3.server";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";

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
  UploadFile = "uploadFile",
  ModifyFile = "modifyFile",
  RemoveFile = "removeFile",
  ModifyPrivacy = "modifyPrivacy",
}

export const action: ActionFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UploadFile: {
      const file = form.get("file");

      if (!(file instanceof File)) {
        throw new Response("Invalid file", { status: 400 });
      }

      const { fid } = await db.file.create({
        data: {
          pid,
          filename: file.name,
          filesize: file.size,
          mimetype: file.type,
        },
      });

      await s3.writeFile(
        `/file/${fid}`,
        Buffer.from(await file.arrayBuffer()),
        file.type
      );

      return null;
    }

    case ActionType.RemoveFile: {
      const fid = invariant(uuidScheme.safeParse(form.get("fid")));

      const file = await db.file.delete({
        where: { fid },
      });

      if (!file) {
        throw new Response("File not found", { status: 404 });
      }

      await s3.removeFile(`/file/${fid}`);

      return null;
    }

    case ActionType.ModifyFile: {
      throw new Response("Not implemented", { status: 501 });
    }

    case ActionType.ModifyPrivacy: {
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

function ProblemFileUploader() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit" name="_action" value={ActionType.UploadFile}>
        上传捏
      </button>
    </fetcher.Form>
  );
}

function ProblemFileListItem({ file }: { file: ProblemFile }) {
  const fetcher1 = useFetcher();
  const isDeleting = fetcher1.state !== "idle";
  const fetcher2 = useFetcher();
  const isSetting = fetcher2.state !== "idle";

  return (
    <tr style={{ opacity: isDeleting ? 0.25 : 1 }}>
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
        <fetcher1.Form method="post" style={{ display: "inline-block" }}>
          <input type="hidden" name="fid" value={file.fid} />
          <button
            type="submit"
            name="_action"
            value={ActionType.RemoveFile}
            disabled={isDeleting}
          >
            删除捏
          </button>
        </fetcher1.Form>
        <fetcher2.Form method="post" style={{ display: "inline-block" }}>
          <input type="hidden" name="fid" value={file.fid} />
          <button
            type="submit"
            name="_action"
            value={ActionType.ModifyPrivacy}
            disabled={isSetting}
          >
            {file.private ? "公开" : "隐藏"}
          </button>
        </fetcher2.Form>
      </td>
    </tr>
  );
}

function ProblemFileList({ files }: { files: ProblemFile[] }) {
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
          <ProblemFileListItem file={file} key={file.fid} />
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
      <ProblemFileUploader />
      <ProblemFileList files={files} />
    </>
  );
}

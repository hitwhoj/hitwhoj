import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import {
  createProblemData,
  createProblemFile,
  removeFile,
} from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import { Space, Typography } from "@arco-design/web-react";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findProblemTeam } from "~/utils/db/problem";
import { FileList } from "~/src/file/FileList";
import { FileUploader } from "~/src/file/FileUploader";

export async function loader({ request, params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      title: true,
      files: { orderBy: { filename: "asc" } },
      data: { orderBy: { filename: "asc" } },
    },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑数据: ${data?.problem.title} - HITwh OJ`,
});

enum ActionType {
  UploadData = "uploadData",
  UploadFile = "uploadFile",
  RemoveData = "removeData",
  RemoveFile = "removeFile",
}

export async function action({ request, params }: ActionArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

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

      return;
    }

    case ActionType.RemoveData:
    case ActionType.RemoveFile: {
      const fid = invariant(uuidScheme, form.get("fid"));

      // 删除文件
      await removeFile(fid);

      return;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
}

export default function ProblemData() {
  const {
    problem: { files, data },
  } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={4}>测试数据</Typography.Title>
      <Typography.Paragraph>用于评测的数据文件</Typography.Paragraph>
      <Space direction="vertical" size="medium" style={{ display: "flex" }}>
        <FileUploader uploadAction={ActionType.UploadData} />
        <FileList files={data} deleteAction={ActionType.RemoveData} />
      </Space>

      <Typography.Title heading={4}>附加文件</Typography.Title>
      <Typography.Paragraph>
        题目的附加资料，例如样例数据、PDF 题面等
      </Typography.Paragraph>
      <Space direction="vertical" size="medium" style={{ display: "flex" }}>
        <FileUploader uploadAction={ActionType.UploadFile} />
        <FileList files={files} deleteAction={ActionType.RemoveFile} />
      </Space>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

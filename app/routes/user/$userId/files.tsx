import { Typography } from "@arco-design/web-react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { createUserFile, removeFile } from "~/utils/files";
import { invariant } from "~/utils/invariant";
import { idScheme, uuidScheme } from "~/utils/scheme";
import { handler } from "~/utils/server/handler.server";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { FileUploader } from "~/src/file/FileUploader";
import { FileList } from "~/src/file/FileList";

export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });

  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_EDIT_USER_PROFILE_SELF
      : Permissions.PERM_EDIT_USER_PROFILE
  );

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
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `用户文件: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

enum ActionType {
  UploadFile = "uploadFile",
  RemoveFile = "removeFile",
}

export async function action({ request, params }: ActionArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_EDIT_USER_PROFILE_SELF
      : Permissions.PERM_EDIT_USER_PROFILE
  );

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

      return;
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

      return;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
}

export default function UserFilePage() {
  const {
    user: { createdFiles: files },
  } = useLoaderData<typeof loader>();

  return (
    <Typography>
      <Typography.Title heading={4}>用户文件</Typography.Title>
      <Typography.Paragraph>
        上传即代表同意我们的用户手册（虽然没有这个东西）
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FileUploader uploadAction={ActionType.UploadFile} />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <FileList files={files} deleteAction={ActionType.RemoveFile} />
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

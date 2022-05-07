import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { uuidScheme } from "~/utils/scheme";

type LoaderData = {
  filename: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const fid = invariant(uuidScheme.safeParse(params.fid), { status: 404 });

  const file = await db.file.findUnique({
    where: { fid },
    select: {
      fid: true,
      private: true,
      filesize: true,
      mimetype: true,
      filename: true,
      createdAt: true,
      pid: true,
      uid: true,
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  // 用户上传的文件
  if (file.uid) {
    await guaranteePermission(
      request,
      file.private
        ? Permissions.User.File.DownloadPrivate
        : Permissions.User.File.DownloadPublic,
      {
        uid: file.uid,
        fid: file.fid,
      }
    );
  }

  // 检查是否有权限下载该题目的文件
  else if (file.pid) {
    await guaranteePermission(
      request,
      file.private
        ? Permissions.Problem.Data.Download
        : Permissions.Problem.File.Download,
      {
        pid: file.pid,
        fid: file.fid,
      }
    );
  }

  // 奇怪的文件，不知道属于谁
  else {
    // TODO: 系统文件
    throw new Response("Unknown file", { status: 501 });
  }

  // 如果有文件下载权限，则返回文件的预览功能

  return json({ filename: file.filename });
};

export default function FileIndex() {
  const { filename } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>{filename}</h1>
      <Outlet />
    </>
  );
}

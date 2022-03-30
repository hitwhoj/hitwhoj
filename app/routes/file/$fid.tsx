import { File, Problem, User } from "@prisma/client";
import { json, Link, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { s3 } from "~/utils/s3.server";
import { uuidScheme } from "~/utils/scheme";

export const loader: LoaderFunction = async ({ request, params }) => {
  const fid = invariant(uuidScheme.safeParse(params.fid), { status: 404 });

  const file = await db.file.findUnique({
    where: { fid },
    select: {
      fid: true,
      private: true,
      pid: true,
      uid: true,
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  let filepath: string;

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

    filepath = `/user/${file.uid}/${file.fid}`;
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

    filepath = `/problem/${file.pid}/${file.fid}`;
  }

  // 奇怪的文件，不知道属于谁
  else {
    // TODO: 系统文件
    throw new Response("Unknown file location", { status: 501 });
  }

  // 如果有文件下载权限，则返回文件
  // TODO: 返回部分文件
  return new Response(await s3.readFileAsText(filepath));
};

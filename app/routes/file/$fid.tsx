import { File, Problem, User } from "@prisma/client";
import { json, Link, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { s3 } from "~/utils/s3.server";
import { uuidScheme } from "~/utils/scheme";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
function encodeRFC5987ValueChars(str: string) {
  return (
    encodeURIComponent(str)
      // Note that although RFC3986 reserves "!", RFC5987 does not,
      // so we do not need to escape it
      .replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16)) // i.e., %27 %28 %29 %2a (Note that valid encoding of "*" is %2A
      // which necessitates calling toUpperCase() to properly encode)
      // The following are not required for percent-encoding per RFC5987,
      // so we can allow for a little better readability over the wire: |`^
      .replace(/%(7C|60|5E)/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
  );
}

// FIXME: 切换到另外一个域名来提供下载文件的功能
function escapeMimetype(mimetype: string) {
  // 媒体类型
  if (
    mimetype.startsWith("audio/") ||
    mimetype.startsWith("video/") ||
    mimetype.startsWith("image/")
  ) {
    return mimetype;
  }

  // 文本类型
  if (mimetype.startsWith("text/")) {
    return "text/plain";
  }

  return "application/octet-stream";
}

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
      updatedAt: true,
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

  const headers = new Headers();
  headers.set("Accept-Ranges", "bytes");
  const mimetype = escapeMimetype(file.mimetype);

  // 返回部分文件
  if (request.headers.has("Range")) {
    const range = request.headers.get("Range")!;

    if (range.startsWith("bytes=")) {
      const bytes = range.slice(6);
      const match = /^(\d+)-(\d*)$/.exec(bytes);

      if (match) {
        const start = parseInt(match[1]);
        const end = match[2] ? parseInt(match[2]) : file.filesize - 1;

        if (start >= 0 && start <= end && end < file.filesize) {
          headers.set("Content-Type", mimetype);
          headers.set(
            "Content-Range",
            `bytes ${start}-${end}/${file.filesize}`
          );

          return new Response(
            await s3.readFilePartialAsBuffer(filepath, start, end - start + 1),
            {
              status: 206,
              headers,
            }
          );
        }
      }
    }

    headers.set("Content-Range", `bytes */${file.filesize}`);

    // 如果 Range 头不合法，则返回 416
    return new Response("Range Not Satisfiable", {
      status: 416,
      headers,
    });
  }

  // 返回整体文件
  else {
    headers.set("Content-Type", mimetype);
    // 提供浏览器内预览功能
    // 如果不行则直接下载
    headers.set(
      "Content-Disposition",
      `inline; filename*=UTF-8''${encodeRFC5987ValueChars(file.filename)}`
    );
    // 最后修改时间
    headers.set("Last-Modified", new Date(file.updatedAt).toUTCString());
    // 添加长时间缓存
    // FIXME: 这个是不是和 Last-Modified 冲突？
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(await s3.readFileAsBuffer(filepath), {
      status: 200,
      headers,
    });
  }
};

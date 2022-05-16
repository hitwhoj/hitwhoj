import type { LoaderFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { s3 } from "~/utils/s3.server";
import { uuidScheme } from "~/utils/scheme";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
 */
function encodeRFC5987ValueChars(str: string) {
  return encodeURIComponent(str)
    .replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16))
    .replace(/%(7C|60|5E)/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
}

function parseRange(range: string, filesize: number): [number, number] | false {
  if (!range.startsWith("bytes=")) {
    return false;
  }

  const bytes = range.slice(6);
  const match = /^(\d+)-(\d*)$/.exec(bytes);

  if (!match) {
    return false;
  }

  const start = parseInt(match[1]);
  const end = match[2] ? parseInt(match[2]) : filesize - 1;

  if (start < 0 || (start > end && end >= filesize)) {
    return false;
  }

  return [start, end];
}

export const loader: LoaderFunction<Response> = async ({ request, params }) => {
  const fileId = invariant(uuidScheme.safeParse(params.fileId), {
    status: 404,
  });

  const file = await db.file.findUnique({
    where: { id: fileId },
    select: { id: true, filesize: true, mimetype: true, filename: true },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  const filepath = `/files/${file.id}`;

  const headers = new Headers();
  headers.set("Accept-Ranges", "bytes");

  // 返回部分文件
  if (request.headers.has("Range")) {
    const range = request.headers.get("Range")!;
    const result = parseRange(range, file.filesize);

    // 如果不是有效的 Range，则返回 416
    if (!result) {
      headers.set("Content-Range", `bytes */${file.filesize}`);
      throw new Response("Invalid range", { status: 416, headers });
    }

    // 返回部分文件
    const [start, end] = result;
    headers.set("Content-Type", file.mimetype);
    headers.set("Content-Range", `bytes ${start}-${end}/${file.filesize}`);

    return new Response(
      await s3.readFilePartial(filepath, start, end - start + 1),
      {
        status: 206,
        headers,
      }
    );
  }

  // 返回整体文件
  else {
    // FIXME: 如果 Context-Type 是 application/javascript，则会被解析为脚本？
    headers.set("Content-Type", file.mimetype);
    // 文件永远不会变，于是可以设置添加永久 Caching
    headers.set("Cache-Control", "public, max-age=31536000");
    // 直接下载文件，防止 XSS 注入
    headers.set(
      "Content-Disposition",
      "attachment; filename*=UTF-8''" + encodeRFC5987ValueChars(file.filename)
    );

    return new Response(await s3.readFile(filepath), {
      status: 200,
      headers,
    });
  }
};

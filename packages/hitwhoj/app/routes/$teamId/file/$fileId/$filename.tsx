import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { s3 } from "~/utils/server/s3.server";
import { uuidScheme } from "~/utils/scheme";
import type { LoaderArgs } from "@remix-run/node";

const WHITELIST = [
  // 所有视频
  "video/",
  // 所有音频
  "audio/",
  // 文本文件
  "text/plain",
  // 所有图片
  "image/",
  // pdf 文件
  "application/pdf",
];

/**
 * Encode filename to be used in Content-Disposition header
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_content-disposition_and_link_headers
 */
// function encodeRFC5987ValueChars(str: string) {
//   return encodeURIComponent(str)
//     .replace(/['()*]/g, (c) => "%" + c.charCodeAt(0).toString(16))
//     .replace(/%(7C|60|5E)/g, (_, hex) =>
//       String.fromCharCode(parseInt(hex, 16))
//     );
// }

/**
 * Parse range for Content-Range header
 *
 * @private
 */
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

  if (start < 0 || start > end || end >= filesize) {
    return false;
  }

  return [start, end];
}

export async function loader({ request, params }: LoaderArgs) {
  const fileId = invariant(uuidScheme, params.fileId, { status: 404 });

  const file = await db.file.findUnique({
    where: { id: fileId },
    select: { id: true, filesize: true, mimetype: true, filename: true },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  const filepath = `/file/${file.id}`;

  const headers = new Headers();
  headers.set("Accept-Ranges", "bytes");

  // 检查是否是安全的 MIME 类型
  if (!WHITELIST.some((prefix) => file.mimetype.startsWith(prefix))) {
    // 设置 CSP，关闭嗅探，防止 XSS 攻击
    headers.set("Content-Security-Policy", "default-src 'none'");
    headers.set("X-Content-Type-Options", "nosniff");
  }

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
      { status: 206, headers }
    );
  }

  // 返回整体文件
  else {
    headers.set("Content-Type", file.mimetype);
    headers.set("Cache-Control", "public, max-age=31536000");
    headers.set("Content-Disposition", "inline");

    return new Response(await s3.readFile(filepath), { headers });
  }
}

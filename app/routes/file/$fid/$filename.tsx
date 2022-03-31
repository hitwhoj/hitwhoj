import { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { s3 } from "~/utils/s3.server";
import { uuidScheme } from "~/utils/scheme";

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

export const loader: LoaderFunction = async ({ request, params }) => {
  const fid = invariant(uuidScheme.safeParse(params.fid), { status: 404 });

  const file = await db.file.findUnique({
    where: { fid },
    select: {
      fid: true,
      filesize: true,
      mimetype: true,
      pid: true,
      uid: true,
    },
  });

  // 权限在父级已经检查过了，这里不需要再检查

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  const filepath = file.pid
    ? `/problem/${file.pid}/${file.fid}`
    : `/user/${file.uid}/${file.fid}`;

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
      await s3.readFilePartialAsBuffer(filepath, start, end - start + 1),
      {
        status: 206,
        headers,
      }
    );
  }

  // 返回整体文件
  else {
    // 直接下载文件，防止 XSS 注入
    headers.set("Content-Disposition", "attachment");
    // FIXME: 如果 Context-Type 是 application/javascript，则会被解析为脚本？
    headers.set("Content-Type", file.mimetype);
    // 文件永远不会变，于是可以设置可以添加永久 Caching
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(await s3.readFileAsBuffer(filepath), {
      status: 200,
      headers,
    });
  }
};

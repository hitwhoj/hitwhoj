import { db } from "./db.server";
import { s3 } from "./s3.server";

/**
 * 将文件上传到 MinIO，并在数据库中保存文件信息
 *
 * @param file 文件对象
 * @param config 所属的用户或者题目
 */
export async function createFile(
  file: File,
  config: { uid: number } | { pid: number }
) {
  const { fid } = await db.file.create({
    data: {
      ...config,
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
}

/**
 * 从 MinIO 中删除文件，并从数据库中删除记录
 *
 * 如果文件不存在，则会抛出 Response 异常
 */
export async function removeFile(fid: string) {
  const file = await db.file.delete({ where: { fid } });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  await s3.removeFile(`/file/${fid}`);
}

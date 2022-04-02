import { db } from "./db.server";
import { s3 } from "./s3.server";

/**
 * 将文件上传到 MinIO，并在数据库中保存文件信息
 *
 * @param file 文件对象
 * @param uid 用户 ID
 */
export async function createUserFile(file: File, uid: number) {
  const { fid } = await db.file.create({
    data: {
      user: { connect: { uid } },
      filename: file.name,
      filesize: file.size,
      mimetype: file.type,
    },
  });

  await s3.writeFile(
    `/user/${uid}/${fid}`,
    Buffer.from(await file.arrayBuffer()),
    file.type
  );

  return fid;
}

/**
 * 上传文件到 MinIO，并在数据库中保存文件信息
 *
 * @param file 文件对象
 * @param pid 题目 ID
 * @param priv 是否为数据文件
 */
export async function createProblemFile(
  file: File,
  pid: number,
  priv: boolean
) {
  const { fid } = await db.file.create({
    data: {
      problem: { connect: { pid } },
      filename: file.name,
      filesize: file.size,
      mimetype: file.type,
      private: priv,
    },
  });

  await s3.writeFile(
    `/problem/${pid}/${fid}`,
    Buffer.from(await file.arrayBuffer()),
    file.type
  );

  return fid;
}

/**
 * 从 MinIO 中删除文件，并从数据库中删除记录
 *
 * 如果文件不存在，则会抛出 Response 异常
 */
export async function removeFile(fid: string) {
  const file = await db.file.delete({
    where: { fid },
    select: {
      fid: true,
      user: { select: { uid: true } },
      problem: { select: { pid: true } },
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  if (file.user) {
    await s3.removeFile(`/user/${file.user.uid}/${file.fid}`);
  } else if (file.problem) {
    await s3.removeFile(`/problem/${file.problem.pid}/${file.fid}`);
  } else {
    throw new Response("File not found", { status: 404 });
  }
}

/**
 * 从 MinIO 中读取文件
 *
 * 如果文件不存在，则会抛出 Response 异常
 */
export async function readFile(fid: string) {
  const file = await db.file.findUnique({
    where: { fid },
    select: {
      fid: true,
      user: { select: { uid: true } },
      problem: { select: { pid: true } },
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  if (file.user) {
    return await s3.readFile(`/user/${file.user.uid}/${file.fid}`);
  } else if (file.problem) {
    return await s3.readFile(`/problem/${file.problem.pid}/${file.fid}`);
  } else {
    throw new Response("File not found", { status: 404 });
  }
}

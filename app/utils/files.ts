import { db } from "./db.server";
import { s3 } from "./s3.server";

/** 创建用户文件 */
export async function createUserFile(file: File, userId: number) {
  const { id: fileId } = await db.file.create({
    data: {
      filename: file.name,
      filesize: file.size,
      mimetype: file.type,
      user: { connect: { id: userId } },
    },
    select: {
      id: true,
    },
  });

  await s3.writeFile(
    `/file/${fileId}`,
    Buffer.from(await file.arrayBuffer()),
    file.type
  );

  return fileId;
}

/** 上传题目文件 */
export async function createProblemFile(file: File, problemId: number) {
  const { id: fileId } = await db.file.create({
    data: {
      filename: file.name,
      filesize: file.size,
      mimetype: file.type,
      fileProblem: { connect: { id: problemId } },
    },
  });

  await s3.writeFile(
    `/file/${fileId}`,
    Buffer.from(await file.arrayBuffer()),
    file.type
  );

  return fileId;
}

/** 上传题目数据 */
export async function createProblemData(file: File, problemId: number) {
  const { id: fileId } = await db.file.create({
    data: {
      filename: file.name,
      filesize: file.size,
      mimetype: file.type,
      dataProblem: { connect: { id: problemId } },
    },
  });

  await s3.writeFile(
    `/file/${fileId}`,
    Buffer.from(await file.arrayBuffer()),
    file.type
  );

  return fileId;
}

/**
 * 从 MinIO 中删除文件，并从数据库中删除记录
 *
 * 如果文件不存在，则会抛出 Response 异常
 */
export async function removeFile(fileId: string) {
  const file = await db.file.delete({
    where: { id: fileId },
    select: { id: true },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  await s3.removeFile(`/file/${file.id}`);
}

/**
 * 从 MinIO 中读取文件
 *
 * 如果文件不存在，则会抛出 Response 异常
 */
export async function readFile(fileId: string) {
  const file = await db.file.findUnique({
    where: { id: fileId },
    select: { id: true },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  return await s3.readFile(`/file/${file.id}`);
}

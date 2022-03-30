import { File, Problem, User } from "@prisma/client";
import { json, Link, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { uuidScheme } from "~/utils/scheme";

type LoaderData = {
  file: File & {
    problem: Pick<Problem, "pid" | "title">;
    user: Pick<User, "uid" | "username" | "nickname">;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const fid = invariant(uuidScheme.safeParse(params.fid), { status: 404 });

  const file = await db.file.findUnique({
    where: { fid },
    include: {
      problem: {
        select: {
          pid: true,
          title: true,
        },
      },
      user: {
        select: {
          uid: true,
          username: true,
          nickname: true,
        },
      },
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  // 用户上传的文件
  if (file.user?.uid) {
    await guaranteePermission(
      request,
      file.private
        ? Permissions.User.File.DownloadPrivate
        : Permissions.User.File.DownloadPublic,
      {
        uid: file.user.uid,
        fid: file.fid,
      }
    );
  }

  // 检查是否有权限下载该题目的文件
  if (file.problem?.pid) {
    await guaranteePermission(
      request,
      file.private
        ? Permissions.Problem.Data.Download
        : Permissions.Problem.File.Download,
      {
        pid: file.problem.pid,
        fid: file.fid,
      }
    );
  }

  return json({ file });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `文件: ${data?.file.filename} - HITwh OJ`,
});

export default function FileIndex() {
  const { file } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>{file.filename}</h1>
      {file.private && <b>[Private]</b>}
      <p>size: {file.filesize}</p>
      <p>type: {file.mimetype}</p>
      {file.problem && (
        <p>
          This file belongs to{" "}
          <Link to={`/problem/${file.problem.pid}`}>
            [{file.problem.title}]
          </Link>
        </p>
      )}
      {file.user && (
        <p>
          Uploaded by{" "}
          <Link to={`/user/${file.user.uid}`}>
            {file.user.nickname
              ? `${file.user.nickname} (@${file.user.username})`
              : `@${file.user.username}`}
          </Link>
        </p>
      )}
    </div>
  );
}

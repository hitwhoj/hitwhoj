import { File, Problem, User } from "@prisma/client";
import { json, Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";

type LoaderData = {
  file: File & {
    problem: Pick<Problem, "pid" | "title">;
    user: Pick<User, "uid" | "username" | "nickname">;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
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

  return json({ file });
};

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

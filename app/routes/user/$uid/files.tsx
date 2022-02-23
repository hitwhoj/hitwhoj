import { UserFile } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = UserFile[];

export const loader: LoaderFunction = async ({ params }) => {
  const uid = Number(params.uid);

  if (isNaN(uid)) {
    throw new Response("Invalid user id", { status: 404 });
  }

  const user = await db.user.findUnique({
    where: { uid },
    select: { createdFiles: true },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json(user.createdFiles);
};

export default function UserFiles() {
  const files = useLoaderData<LoaderData>();

  return (
    <>
      {files.length ? (
        files.map((file) => (
          <p key={file.fid}>
            <a href={`/files/${file.fid}`}>{file.filename}</a>
          </p>
        ))
      ) : (
        <p>no files</p>
      )}
    </>
  );
}

import { UserFile } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { ensureNumericId, invariant } from "~/utils/invariant";

type LoaderData = {
  files: UserFile[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const uid = invariant(ensureNumericId(params.uid), "uid is required");

  const user = await db.user.findUnique({
    where: { uid },
    select: { createdFiles: true },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ files: user.createdFiles });
};

export default function UserFiles() {
  const { files } = useLoaderData<LoaderData>();

  return (
    <>
      {files.length ? (
        <ul>
          {files.map((file) => (
            <li key={file.fid}>
              <a href={`/files/${file.fid}`}>{file.filename}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>没有文件捏</p>
      )}
    </>
  );
}

import type { File as ProblemFile } from "@prisma/client";
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  unstable_parseMultipartFormData,
  useFetcher,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { s3 } from "~/utils/s3.server";
import { idScheme } from "~/utils/scheme";
import { uploadHandler } from "~/utils/uploadHandler";

type LoaderData = {
  files: ProblemFile[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });

  const problem = await db.problem.findUnique({
    where: { pid },
    select: { files: true },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ files: problem.files });
};

enum ActionType {
  Upload = "upload",
  Delete = "delete",
}

export const action: ActionFunction = async ({ request, params }) => {
  const pid = invariant(idScheme.safeParse(params.pid), { status: 404 });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.Upload: {
      const file = form.get("file");

      if (!(file instanceof File)) {
        throw new Response("Invalid file", { status: 400 });
      }

      const { fid } = await db.file.create({
        data: {
          pid,
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

      return redirect("/");
    }

    case ActionType.Delete: {
      throw new Response("Not implemented", { status: 501 });
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

function FileUploader() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit" name="_action" value={ActionType.Upload}>
        上传捏
      </button>
    </fetcher.Form>
  );
}

function FileList({ files }: { files: ProblemFile[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.fid}>
            <td>
              <Link to={`/file/${file.fid}`}>{file.filename}</Link>
            </td>
            <td>{file.filesize}</td>
            <td>{file.mimetype}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ProblemData() {
  const { files } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>Problem Data</h1>
      <FileUploader />
      <FileList files={files} />
    </>
  );
}

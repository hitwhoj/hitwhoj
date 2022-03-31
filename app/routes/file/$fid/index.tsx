import { Button } from "@arco-design/web-react";
import { File } from "@prisma/client";
import { json, Link, LoaderFunction, useLoaderData, useParams } from "remix";
import Highlighter from "~/src/Highlighter";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";

type LoaderData = {
  file: Pick<File, "mimetype" | "filename">;
};

export const loader: LoaderFunction = async ({ params }) => {
  const fid = invariant(uuidScheme.safeParse(params.fid), { status: 404 });

  const file = await db.file.findUnique({
    where: { fid },
    select: {
      mimetype: true,
      filename: true,
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  return json({ file });
};

export default function FileIndex() {
  const { file } = useLoaderData<LoaderData>();
  const { fid } = useParams();

  const filelink = `/file/${fid}/${file.filename}`;

  if (file.mimetype.startsWith("audio/")) {
    return <audio controls src={filelink} style={{ width: "100%" }} />;
  } else if (file.mimetype.startsWith("video/")) {
    return <video controls src={filelink} style={{ width: "100%" }} />;
  } else if (file.mimetype.startsWith("image/")) {
    return <img src={filelink} style={{ width: "100%" }} />;
  } else {
    return (
      <Link to={filelink} target="_blank" rel="noreferrer noopener">
        <Button type="primary">Download</Button>
      </Link>
    );
  }
}

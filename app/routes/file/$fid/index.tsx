import { Button, Image, Space } from "@arco-design/web-react";
import { File } from "@prisma/client";
import { json, Link, LoaderFunction, useLoaderData, useParams } from "remix";
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

  const filelink = `/file/${fid}/raw`;

  return (
    <Space direction="vertical" style={{ display: "flex" }} size="medium">
      {file.mimetype.startsWith("audio/") ? (
        <audio controls src={filelink} style={{ maxWidth: "100%" }} />
      ) : file.mimetype.startsWith("video/") ? (
        <video
          controls
          src={filelink}
          style={{ maxHeight: "80vh", maxWidth: "100%" }}
        />
      ) : file.mimetype.startsWith("image/") ? (
        <Image src={filelink} alt={file.filename} />
      ) : null}
      <Link
        to={filelink}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="download"
      >
        <Button type="primary">Download</Button>
      </Link>
    </Space>
  );
}

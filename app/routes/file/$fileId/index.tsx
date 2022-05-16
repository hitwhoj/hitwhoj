import { Button, Image, Space } from "@arco-design/web-react";
import type { File } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";

type LoaderData = {
  file: Pick<File, "id" | "mimetype" | "filename">;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const fileId = invariant(uuidScheme.safeParse(params.fileId), {
    status: 404,
  });

  const file = await db.file.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      mimetype: true,
      filename: true,
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  return { file };
};

export default function FileIndex() {
  const { file } = useLoaderData<LoaderData>();

  const filelink = `/file/${file.id}/${file.filename}`;

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

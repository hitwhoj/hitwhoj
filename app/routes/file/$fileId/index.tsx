import { Button, Image, Typography } from "@arco-design/web-react";
import type { File } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";
import { IconDownload } from "@arco-design/web-react/icon";

type LoaderData = {
  file: Pick<File, "id" | "mimetype" | "filename">;
};

export function loader({ params }: LoaderArgs) {
  const fileId = invariant(uuidScheme, params.fileId, {
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
}

export const meta: MetaFunction<LoaderData> = ({ data }) => ({
  title: `文件: ${data?.file.filename} - HITwh OJ`,
});

export default function FileIndex() {
  const { file } = useLoaderData<LoaderData>();

  const filelink = `/file/${file.id}/${file.filename}`;

  return (
    <Typography>
      <Typography.Paragraph>
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
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Link
          to={filelink}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="download"
          download
          // 默认是 inline 好像会有点问题
          style={{ display: "inline-block" }}
        >
          <Button type="primary" icon={<IconDownload />}>
            下载
          </Button>
        </Link>
      </Typography.Paragraph>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

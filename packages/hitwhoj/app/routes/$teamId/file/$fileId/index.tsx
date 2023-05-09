import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";
import { HiOutlineArrowsExpand, HiOutlineDownload } from "react-icons/hi";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { teamIdScheme } from "~/utils/new-permission/scheme";

export async function loader({ params }: LoaderArgs) {
  const fileId = invariant(uuidScheme, params.fileId, { status: 404 });
  const teamId = invariant(teamIdScheme, params.teamId, { status: 404 });
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

  return json({ file, teamId });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `文件: ${data?.file.filename} - HITwh OJ`,
});

export default function FileIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const file = useComputed(() => loaderData.value.file);
  const teamId = useComputed(() => loaderData.value.teamId);
  const filelink = useComputed(
    () => `/${teamId}/file/${file.value.id}/${file.value.filename}`
  );

  return (
    <>
      {/* previews for audio/video/images */}
      {file.value.mimetype.startsWith("audio/") ? (
        <audio controls src={filelink.value} style={{ maxWidth: "100%" }} />
      ) : file.value.mimetype.startsWith("video/") ? (
        <video
          controls
          src={filelink.value}
          style={{ maxHeight: "80vh", maxWidth: "100%" }}
        />
      ) : file.value.mimetype.startsWith("image/") ? (
        <img src={filelink.value} alt={file.value.filename} />
      ) : null}

      <p className="flex gap-4">
        {file.value.mimetype === "application/pdf" && (
          <Link
            to={filelink.value}
            className="btn btn-primary gap-2"
            reloadDocument
          >
            <HiOutlineArrowsExpand />
            <span>在标签页中打开</span>
          </Link>
        )}
        <Link
          className="btn btn-primary gap-2"
          to={filelink.value}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="download"
          download
        >
          <HiOutlineDownload />
          <span>下载</span>
        </Link>
      </p>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

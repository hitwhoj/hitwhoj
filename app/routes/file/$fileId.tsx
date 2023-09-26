import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";

export async function loader({ params }: LoaderArgs) {
  const fileId = invariant(uuidScheme, params.fileId, { status: 404 });

  const file = await db.file.findUnique({
    where: { id: fileId },
    select: { filename: true },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  return json({ filename: file.filename });
}

export default function FileIndex() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const filename = useComputed(() => loaderData.value.filename);

  return (
    <>
      <h1>{filename.value}</h1>
      <Outlet />
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

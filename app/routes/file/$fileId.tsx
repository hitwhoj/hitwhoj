import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";

type LoaderData = {
  filename: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const fileId = invariant(uuidScheme.safeParse(params.fileId), {
    status: 404,
  });

  const file = await db.file.findUnique({
    where: { id: fileId },
    select: {
      id: true,
      filesize: true,
      mimetype: true,
      filename: true,
      createdAt: true,
    },
  });

  if (!file) {
    throw new Response("File not found", { status: 404 });
  }

  return json({ filename: file.filename });
};

export default function FileIndex() {
  const { filename } = useLoaderData<LoaderData>();

  return (
    <>
      <h1>{filename}</h1>
      <Outlet />
    </>
  );
}

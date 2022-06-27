import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { uuidScheme } from "~/utils/scheme";
import { Typography } from "@arco-design/web-react";

type LoaderData = {
  filename: string;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const fileId = invariant(uuidScheme, params.fileId, {
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

  return { filename: file.filename };
};

export default function FileIndex() {
  const { filename } = useLoaderData<LoaderData>();

  return (
    <Typography>
      <Typography.Title heading={3}>{filename}</Typography.Title>

      <Typography.Paragraph>
        <Outlet />
      </Typography.Paragraph>
    </Typography>
  );
}

import { Record } from "@prisma/client";
import { json, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { readFileAsText } from "~/utils/s3.server";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  record: Pick<Record, "rid" | "detail" | "points" | "status">;
  code: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  const rid = invariant(idScheme.safeParse(params.rid), { status: 404 });

  const record = await db.record.findUnique({
    where: { rid },
    select: {
      rid: true,
      detail: true,
      points: true,
      status: true,
    },
  });

  if (!record) {
    throw new Response("Record not found", { status: 404 });
  }

  const code = await readFileAsText(`/record/${record.rid}`);

  return json({
    record,
    code,
  });
};

export default function Record() {
  const { record, code } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>{record.status}</h1>
      <blockquote>
        <p>{record.detail}</p>
      </blockquote>
      <pre>
        <code>{code}</code>
      </pre>
    </>
  );
}

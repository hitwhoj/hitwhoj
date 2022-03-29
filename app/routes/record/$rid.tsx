import { Record } from "@prisma/client";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { s3 } from "~/utils/s3.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import Highlighter from "~/src/Highlighter";

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

  const code = await s3.readFileAsText(`/record/${record.rid}`);

  return json({
    record,
    code,
  });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `提交记录: ${data?.record.status} - HITwh OJ`,
});

export default function Record() {
  const { record, code } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>{record.status}</h1>
      <blockquote>
        <p>{record.detail}</p>
      </blockquote>
      <Highlighter language="cpp" children={code} />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

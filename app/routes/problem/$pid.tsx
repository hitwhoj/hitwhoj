import { Problem } from "@prisma/client";
import { LoaderFunction, json, useLoaderData, MetaFunction } from "remix";
import { db } from "~/utils/db.server";
import { ensureNumericId, invariant } from "~/utils/invariant";

type LoaderData = {
  problem: Problem;
};

export const loader: LoaderFunction = async ({ params }) => {
  const pid = invariant(ensureNumericId(params.pid), "Pid is required");

  const problem = await db.problem.findUnique({
    where: { pid },
  });

  if (!problem) {
    throw new Response("Problem not found", { status: 404 });
  }

  return json({ problem });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: data.problem.title,
  description: data.problem.description,
});

export default function Problem() {
  const { problem } = useLoaderData<LoaderData>();

  return (
    <div>
      <header>
        <h1>
          <span style={{ color: "grey", marginRight: "20px" }}>
            P{problem.pid}
          </span>
          {problem.title}
        </h1>
      </header>
      <div style={{ margin: "20px 0" }}>{problem.description}</div>
    </div>
  );
}

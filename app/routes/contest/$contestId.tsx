import { Contest } from "@prisma/client";
import {
  LoaderFunction,
  json,
  useLoaderData,
  MetaFunction,
  Outlet,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  contest: Contest;
};

export const loader: LoaderFunction = async ({ params }) => {
  const cid = invariant(idScheme.safeParse(params.contestId), { status: 404 });

  const contest = await db.contest.findUnique({
    where: { cid },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({ contest });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: data.contest.title,
  description: data.contest.description,
});

export default function Contest() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <div>
      <header>
        <h1>
          <span style={{ color: "grey", marginRight: "20px" }}>
            C{contest.cid}
          </span>
          {contest.title}
        </h1>
      </header>
      <Outlet />
    </div>
  );
}

import { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
  useLoaderData,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { ensureId, invariant } from "~/utils/invariant";

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: Pick<Problem, "pid">[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const sid = invariant(ensureId(params.sid), "sid is required");

  const problemSet = await db.problemSet.findUnique({
    where: { sid },
    include: { tags: true, problems: { select: { pid: true, title: true } } },
  });

  return json({ problemSet });
};

export const action: ActionFunction = async ({ params, request }) => {
  const sid = invariant(ensureId(params.sid), "sid is required");
  const form = await request.formData();

  const title = invariant(form.get("title")?.toString(), "title is required");
  const description = invariant(
    form.get("description")?.toString(),
    "description is required"
  );
  const tags = (form.get("tags")?.toString() || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  const problems = (form.get("problems")?.toString() || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean)
    .map((a) => invariant(ensureId(a), "pid should be valid"));

  await db.problemSetTag.createMany({
    data: tags.map((tag) => ({
      name: tag,
    })),
    skipDuplicates: true,
  });

  await db.problemSet.update({
    where: { sid },
    data: {
      title,
      description,
      tags: {
        set: tags.map((tag) => ({ name: tag })),
      },
      problems: {
        connect: problems.map((pid) => ({ pid })),
      },
    },
  });

  return redirect(`/problemset/${sid}`);
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `Edit: ${data.problemSet.title} - HITwh OJ`,
});

export default function ProblemSetEdit() {
  const { problemSet } = useLoaderData<LoaderData>();
  const { state } = useTransition();

  return (
    <>
      <Form method="post">
        <label htmlFor="title">标题</label>
        <input
          id="title"
          name="title"
          type="text"
          disabled={state === "submitting"}
          defaultValue={problemSet.title}
        />
        <br />
        <label htmlFor="description">描述</label>
        <textarea
          id="description"
          name="description"
          disabled={state === "submitting"}
          defaultValue={problemSet.description}
        />
        <br />
        <label htmlFor="tags">标签（按逗号分割）</label>
        <input
          id="tags"
          name="tags"
          type="text"
          disabled={state === "submitting"}
          defaultValue={problemSet.tags.map((tag) => tag.name).join(",")}
        />
        <br />
        <label htmlFor="problems">题目（按逗号分割）</label>
        <input
          id="problems"
          name="problems"
          type="text"
          disabled={state === "submitting"}
          defaultValue={problemSet.problems
            .map((problem) => problem.pid)
            .join(",")}
        />
        <br />
        <button type="submit" disabled={state === "submitting"}>
          提交捏
        </button>
      </Form>
    </>
  );
}

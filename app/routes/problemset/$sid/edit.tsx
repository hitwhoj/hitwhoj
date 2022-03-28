import { Problem, ProblemSet, ProblemSetTag } from "@prisma/client";
import {
  json,
  useFetcher,
  MetaFunction,
  useLoaderData,
  ActionFunction,
  LoaderFunction,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import {
  descriptionScheme,
  idScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";

type LoaderData = {
  problemSet: ProblemSet & {
    tags: ProblemSetTag[];
    problems: Pick<Problem, "pid" | "title">[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const sid = invariant(idScheme.safeParse(params.sid), { status: 404 });

  const problemSet = await db.problemSet.findUnique({
    where: { sid },
    include: {
      tags: true,
      problems: {
        select: {
          pid: true,
          title: true,
        },
      },
    },
  });

  if (!problemSet) {
    throw new Response("Problem Set not found", { status: 404 });
  }

  return json({ problemSet });
};

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  UpdateInformation = "updateInformation",
}

export const action: ActionFunction = async ({ params, request }) => {
  const sid = invariant(idScheme.safeParse(params.sid), { status: 404 });
  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const pid = invariant(idScheme.safeParse(form.get("pid")));

      await db.problemSet.update({
        where: { sid },
        data: {
          problems: {
            connect: {
              pid,
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteProblem: {
      const pid = invariant(idScheme.safeParse(form.get("pid")));

      await db.problemSet.update({
        where: { sid },
        data: {
          problems: {
            disconnect: {
              pid,
            },
          },
        },
      });

      return null;
    }

    case ActionType.CreateTag: {
      const tag = invariant(tagScheme.safeParse(form.get("tag")));

      await db.problemSet.update({
        where: { sid },
        data: {
          tags: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        },
      });

      return null;
    }

    case ActionType.DeleteTag: {
      const tag = invariant(tagScheme.safeParse(form.get("tag")));

      await db.problemSet.update({
        where: { sid },
        data: {
          tags: {
            disconnect: {
              name: tag,
            },
          },
        },
      });

      return null;
    }

    case ActionType.UpdateInformation: {
      const title = invariant(titleScheme.safeParse(form.get("title")));
      const description = invariant(
        descriptionScheme.safeParse(form.get("description"))
      );

      await db.problemSet.update({
        where: { sid },
        data: {
          title,
          description,
        },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => ({
  title: `编辑题单: ${data?.problemSet.title} - HITwh OJ`,
});

function ProblemSetTagItem({ name }: { name: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <li style={{ opacity: isDeleting ? 0.25 : 1 }}>
      {name}{" "}
      <fetcher.Form method="post" style={{ display: "inline" }}>
        <input type="hidden" name="tag" value={name} />
        <button name="_action" value={ActionType.DeleteTag}>
          删除捏
        </button>
      </fetcher.Form>
    </li>
  );
}

function ProblemSetProblemItem({ pid, title }: { pid: number; title: string }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <li style={{ opacity: isDeleting ? 0.25 : 1 }}>
      {title}{" "}
      <fetcher.Form method="post" style={{ display: "inline" }}>
        <input type="hidden" name="pid" value={pid} />
        <button name="_action" value={ActionType.DeleteProblem}>
          删除捏
        </button>
      </fetcher.Form>
    </li>
  );
}

function TitleEditor({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <label htmlFor="title">标题</label>
      <input
        id="title"
        name="title"
        type="text"
        defaultValue={title}
        disabled={isUpdating}
      />
      <br />
      <label htmlFor="description">描述</label>
      <textarea
        id="description"
        name="description"
        defaultValue={description}
        disabled={isUpdating}
      />
      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateInformation}
      >
        提交捏
      </button>
    </fetcher.Form>
  );
}

function ProblemSetTagCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input id="tag" name="tag" type="text" disabled={isCreating} required />
      <button
        type="submit"
        name="_action"
        value={ActionType.CreateTag}
        disabled={isCreating}
      >
        添加捏
      </button>
    </fetcher.Form>
  );
}

function ProblemSetProblemCreator() {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input id="pid" name="pid" type="text" disabled={isCreating} required />
      <button
        type="submit"
        name="_action"
        value={ActionType.CreateProblem}
        disabled={isCreating}
      >
        添加捏
      </button>
    </fetcher.Form>
  );
}

export default function ProblemSetEdit() {
  const { problemSet } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>标题与简介</h2>
      <TitleEditor
        title={problemSet.title}
        description={problemSet.description}
      />

      <h2>标签</h2>
      {problemSet.tags.length ? (
        <ul>
          {problemSet.tags.map(({ name }) => (
            <ProblemSetTagItem name={name} key={name} />
          ))}
        </ul>
      ) : (
        <div>没有标签捏</div>
      )}
      <ProblemSetTagCreator />

      <h2>题目</h2>
      {problemSet.problems.length ? (
        <ul>
          {problemSet.problems.map(({ pid, title }) => (
            <ProblemSetProblemItem pid={pid} title={title} key={pid} />
          ))}
        </ul>
      ) : (
        <div>没有题目捏</div>
      )}
      <ProblemSetProblemCreator />
    </>
  );
}

import { Contest, ContestSystem, ContestTag, Problem } from "@prisma/client";
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
  datetimeStringScheme,
  descriptionScheme,
  idScheme,
  systemScheme,
  tagScheme,
  timezoneScheme,
  titleScheme,
} from "~/utils/scheme";
import { adjustTimezone, getDatetimeLocal } from "~/utils/time";

type LoaderData = {
  contest: Contest & {
    tags: ContestTag[];
    problems: Pick<Problem, "pid" | "title">[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const cid = invariant(idScheme.safeParse(params.contestId), { status: 404 });

  const contest = await db.contest.findUnique({
    where: { cid },
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

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({ contest });
};

enum ActionType {
  CreateTag = "createTag",
  DeleteTag = "deleteTag",
  CreateProblem = "createProblem",
  DeleteProblem = "deleteProblem",
  UpdateInformation = "updateInformation",
  UpdateTime = "updateTime",
  UpdateSystem = "updateSystem",
}

export const action: ActionFunction = async ({ params, request }) => {
  const cid = invariant(idScheme.safeParse(params.contestId), { status: 404 });
  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.CreateProblem: {
      const pid = invariant(idScheme.safeParse(form.get("pid")));

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
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

      await db.contest.update({
        where: { cid },
        data: {
          title,
          description,
        },
      });

      return null;
    }

    case ActionType.UpdateTime: {
      // 客户端所在的时区
      const timezone = invariant(
        timezoneScheme.safeParse(form.get("timezone"))
      );

      const beginTime = adjustTimezone(
        invariant(datetimeStringScheme.safeParse(form.get("beginTime"))),
        timezone
      );
      const endTime = adjustTimezone(
        invariant(datetimeStringScheme.safeParse(form.get("endTime"))),
        timezone
      );

      await db.contest.update({
        where: { cid },
        data: {
          beginTime,
          endTime,
        },
      });

      return null;
    }

    case ActionType.UpdateSystem: {
      const system = invariant(systemScheme.safeParse(form.get("system")));

      await db.contest.update({
        where: { cid },
        data: {
          system,
        },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `Edit Contest: ${data.contest.title} - HITwh OJ`,
});

function ContestTagItem({ name }: { name: string }) {
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

function ContestProblemItem({ pid, title }: { pid: number; title: string }) {
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

function ContestTagCreator() {
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

function ContestProblemCreator() {
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

function TimeEditor({ begin, end }: { begin: Date; end: Date }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input
        type="datetime-local"
        id="beginTime"
        name="beginTime"
        disabled={isUpdating}
        defaultValue={getDatetimeLocal(begin.getTime())}
        required
      />
      <br />
      <input
        type="datetime-local"
        id="endTime"
        name="endTime"
        disabled={isUpdating}
        defaultValue={getDatetimeLocal(end.getTime())}
        required
      />
      <input
        type="hidden"
        name="timezone"
        value={new Date().getTimezoneOffset()}
      />
      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateTime}
      >
        提交捏
      </button>
    </fetcher.Form>
  );
}

function SystemEditor(props: { system: ContestSystem }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <select id="system" name="system" disabled={isUpdating} required>
        {Object.values(ContestSystem).map((system) => (
          <option
            value={system}
            key={system}
            selected={system === props.system}
          >
            {system}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateSystem}
      >
        提交捏
      </button>
    </fetcher.Form>
  );
}

export default function ContestEdit() {
  const { contest } = useLoaderData<LoaderData>();

  return (
    <>
      <h2>标题与简介</h2>
      <TitleEditor title={contest.title} description={contest.description} />

      <h2>时间</h2>
      <TimeEditor
        begin={new Date(contest.beginTime)}
        end={new Date(contest.endTime)}
      />

      <h2>赛制</h2>
      <SystemEditor system={contest.system} />

      <h2>标签</h2>
      {contest.tags.length ? (
        <ul>
          {contest.tags.map(({ name }) => (
            <ContestTagItem name={name} key={name} />
          ))}
        </ul>
      ) : (
        <div>没有标签捏</div>
      )}
      <ContestTagCreator />

      <h2>题目</h2>
      {contest.problems.length ? (
        <ul>
          {contest.problems.map(({ pid, title }) => (
            <ContestProblemItem pid={pid} title={title} key={pid} />
          ))}
        </ul>
      ) : (
        <div>没有题目捏</div>
      )}
      <ContestProblemCreator />
    </>
  );
}

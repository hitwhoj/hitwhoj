import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { HiOutlineTag, HiOutlineX } from "react-icons/hi";
import { ToastContext } from "~/utils/context/toast";
import { findProblemTeam } from "~/utils/db/problem";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import {
  descriptionScheme,
  idScheme,
  limitScheme,
  tagScheme,
  titleScheme,
} from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      description: true,
      timeLimit: true,
      memoryLimit: true,
      private: true,
      allowSubmit: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!problem) {
    throw new Response("题目未找到", { status: 404 });
  }

  return json({ problem });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑题目: ${data?.problem.title} - HITwh OJ`,
});

export async function action({ request, params }: ActionArgs) {
  const problemId = invariant(idScheme, params.problemId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findProblemTeam(problemId))
    .checkPermission(Permissions.PERM_EDIT_PROBLEM);

  const form = await request.formData();
  const title = invariant(titleScheme, form.get("title"));
  const description = invariant(descriptionScheme, form.get("description"));
  const timeLimit = invariant(limitScheme, form.get("timeLimit"));
  const memoryLimit = invariant(limitScheme, form.get("memoryLimit"));
  const priv = form.has("private");
  const submit = form.has("allowSubmit");
  const tags = form.getAll("tag").map((value) => invariant(tagScheme, value));

  await db.$transaction(async (db) => {
    const problem = await db.problem.update({
      where: { id: problemId },
      data: {
        title,
        description,
        timeLimit,
        memoryLimit,
        private: priv,
        allowSubmit: submit,
      },
      select: { tags: { select: { name: true } } },
    });

    await db.problem.update({
      where: { id: problemId },
      data: {
        tags: {
          connectOrCreate: tags
            .filter((tag) => !problem.tags.some((t) => t.name === tag))
            .map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          disconnect: problem.tags
            .filter((tag) => !tags.includes(tag.name))
            .map((tag) => ({ name: tag.name })),
        },
      },
    });
  });

  return null;
}

export default function ProblemEdit() {
  const { problem } = useLoaderData<typeof loader>();

  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const [tags, setTags] = useState(problem.tags.map(({ name }) => name));
  const [tag, setTag] = useState("");

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("更新成功");
    }
  }, [isActionReload]);

  const handleRemoveTag = (name: string) =>
    setTags((tags) => tags.filter((tag) => tag !== name));

  return (
    <Form method="post" className="form-control">
      <label className="label">
        <span className="label-text">题目名称</span>
      </label>
      <input
        className="input input-bordered w-full max-w-xs"
        name="title"
        required
        defaultValue={problem.title}
        disabled={isLoading}
      />

      <label className="label">
        <span className="label-text">题目标签</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((name) => (
          <div className="badge inline-flex gap-1" key={name}>
            <input type="hidden" name="tag" value={name} />
            <HiOutlineTag />
            {name}
            <HiOutlineX
              className="cursor-pointer"
              onClick={() => handleRemoveTag(name)}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <input
          type="text"
          className="input input-bordered"
          value={tag}
          onChange={(event) => setTag(event.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            tag && setTags((tags) => [...tags, tag]);
            setTag("");
          }}
        >
          添加标签
        </button>
      </div>

      <label className="label">
        <span className="label-text">题目正文</span>
      </label>
      <textarea
        className="textarea textarea-bordered w-full"
        name="description"
        required
        defaultValue={problem.description}
        disabled={isLoading}
      />

      <label className="label">
        <span className="label-text">时间限制 (ms, 仅供题面参考)</span>
      </label>
      <input
        className="input input-bordered w-full max-w-xs"
        name="timeLimit"
        type="number"
        required
        defaultValue={String(problem.timeLimit)}
        disabled={isLoading}
      />

      <label className="label">
        <span className="label-text">内存限制 (byte, 仅供题面参考)</span>
      </label>
      <input
        className="input input-bordered w-full max-w-xs"
        name="memoryLimit"
        type="number"
        required
        defaultValue={String(problem.memoryLimit)}
        disabled={isLoading}
      />

      <label className="label cursor-pointer justify-start gap-2 mt-4">
        <input
          className="checkbox checkbox-primary"
          type="checkbox"
          name="private"
          defaultChecked={problem.private}
          disabled={isLoading}
        />
        <span className="label-text">保持题目隐藏</span>
      </label>

      <label className="label cursor-pointer justify-start gap-2">
        <input
          className="checkbox checkbox-primary"
          type="checkbox"
          name="allowSubmit"
          defaultChecked={problem.allowSubmit}
          disabled={isLoading}
        />
        <span className="label-text">允许用户提交</span>
      </label>

      <button
        className="btn btn-primary mt-4 w-full max-w-xs"
        type="submit"
        disabled={isLoading}
      >
        确认修改
      </button>
    </Form>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import { useComputed, useSignalEffect } from "@preact/signals-react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useContext } from "react";
import { TagsEditor } from "~/src/form/TagsEditor";
import { MarkdownEditor } from "~/src/MarkdownEditor";
import { UserLink } from "~/src/user/UserLink";
import { ToastContext } from "~/utils/context/toast";
import { UserContext } from "~/utils/context/user";
import { findProblemTeam } from "~/utils/db/problem";
import { selectUserData } from "~/utils/db/user";
import { useSignalLoaderData, useSignalTransition } from "~/utils/hooks";
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
      lockedBy: {
        select: selectUserData,
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
  const lock = form.has("lock");

  const problem = await db.problem.findUnique({
    where: { id: problemId },
    select: { lockedBy: { select: { id: true } } },
  });

  if (problem?.lockedBy?.id && problem?.lockedBy?.id !== self.userId) {
    throw new Response("题目已被锁定", { status: 403 });
  }

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
        lockedBy: lock
          ? { connect: { id: self.userId! } }
          : { disconnect: true },
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
  const loaderData = useSignalLoaderData<typeof loader>();
  const problem = useComputed(() => loaderData.value.problem);

  const { success, loading } = useSignalTransition();

  const Toasts = useContext(ToastContext);

  useSignalEffect(() => {
    if (success.value) {
      Toasts.success("更新成功");
    }
  });

  const userId = useContext(UserContext);

  const isLocked = useComputed(() => problem.value.lockedBy !== null);
  const isLockedBySelf = useComputed(
    () => userId && problem.value.lockedBy?.id === userId
  );

  return (
    <Form method="post" className="form-control gap-4">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">题目名称</span>
        </label>
        <input
          className="input input-bordered"
          name="title"
          required
          defaultValue={problem.value.title}
          disabled={loading.value}
        />
      </div>

      <TagsEditor
        label="题目标签"
        name="tag"
        defaultTags={problem.value.tags.map(({ name }) => name)}
      />

      <div className="form-control">
        <label className="label">
          <span className="label-text">题目正文</span>
        </label>
        <MarkdownEditor
          name="description"
          defaultValue={problem.value.description}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">时间限制 (ms, 仅供题面参考)</span>
        </label>
        <input
          className="input input-bordered"
          name="timeLimit"
          type="number"
          required
          defaultValue={String(problem.value.timeLimit)}
          disabled={loading.value}
        />
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">内存限制 (byte, 仅供题面参考)</span>
        </label>
        <input
          className="input input-bordered"
          name="memoryLimit"
          type="number"
          required
          defaultValue={String(problem.value.memoryLimit)}
          disabled={loading.value}
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            className="checkbox checkbox-primary"
            type="checkbox"
            name="private"
            defaultChecked={problem.value.private}
            disabled={loading.value}
          />
          <span className="label-text">保持题目隐藏</span>
        </label>

        <label className="label cursor-pointer justify-start gap-2">
          <input
            className="checkbox checkbox-primary"
            type="checkbox"
            name="allowSubmit"
            defaultChecked={problem.value.allowSubmit}
            disabled={loading.value}
          />
          <span className="label-text">允许用户提交</span>
        </label>

        <label className="label cursor-pointer justify-start gap-2">
          <input
            className="checkbox checkbox-primary"
            type="checkbox"
            name="lock"
            defaultChecked={isLocked.value}
            disabled={loading.value || (isLocked && !isLockedBySelf)}
          />
          <span className="label-text">锁定题目</span>
          <div
            className="tooltip h-10"
            data-tip="锁定后，只有锁定人可以编辑本题"
          >
            <button className="btn-link h-10 p-0" type="button">
              ?
            </button>
          </div>
          {isLocked.value &&
            (isLockedBySelf.value ? (
              <span className="label-text text-success">您已锁定该题目</span>
            ) : (
              <span className="label-text text-error">
                该题目已被
                <UserLink user={problem.value.lockedBy!} />
                锁定
              </span>
            ))}
        </label>
      </div>

      <div className="form-control w-full max-w-xs">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading.value || (isLocked.value && !isLockedBySelf.value)}
        >
          确认修改
        </button>
      </div>
    </Form>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

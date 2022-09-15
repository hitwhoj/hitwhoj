import { ContestRegistrationType, ContestSystem } from "@prisma/client";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  datetimeStringScheme,
  descriptionScheme,
  idScheme,
  systemScheme,
  tagScheme,
  timezoneScheme,
  titleScheme,
  weakPasswordScheme,
} from "~/utils/scheme";
import { adjustTimezone, getDatetimeLocal } from "~/utils/time";
import { useContext, useEffect, useState } from "react";
import { selectProblemListData } from "~/utils/db/problem";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { Permissions } from "~/utils/permission/permission";
import { findContestTeam } from "~/utils/db/contest";
import { z } from "zod";
import { ProblemEditor } from "~/src/problem/ProblemEditor";
import { HiOutlineTag, HiOutlineX } from "react-icons/hi";
import { ToastContext } from "~/utils/context/toast";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_EDIT_CONTEST);

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      description: true,
      beginTime: true,
      endTime: true,
      system: true,
      private: true,
      registrationType: true,
      registrationPassword: true,
      allowJoinAfterStart: true,
      tags: { select: { name: true } },
      problems: {
        orderBy: { rank: "asc" },
        select: {
          problem: {
            select: {
              ...selectProblemListData,
            },
          },
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return json({ contest });
}

enum ActionType {
  CreateProblem = "CreateProblem",
  DeleteProblem = "DeleteProblem",
  MoveProblemUp = "MoveProblemUp",
  MoveProblemDown = "MoveProblemDown",
  UpdateInformation = "UpdateInformation",
}

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_EDIT_CONTEST);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    // 创建题目
    case ActionType.CreateProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const {
          _max: { rank },
        } = await db.contestProblem.aggregate({
          where: { contestId },
          _max: { rank: true },
        });

        await db.contestProblem.create({
          data: {
            contestId,
            problemId,
            rank: (rank ?? 0) + 1,
          },
        });
      });

      return null;
    }

    // 删除题目
    case ActionType.DeleteProblem: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const { rank } = await db.contestProblem.delete({
          where: {
            contestId_problemId: {
              contestId,
              problemId,
            },
          },
        });

        await db.contestProblem.updateMany({
          where: { contestId, rank: { gte: rank } },
          data: { rank: { decrement: 1 } },
        });
      });

      return null;
    }

    // 移动题目
    case ActionType.MoveProblemUp:
    case ActionType.MoveProblemDown: {
      const problemId = invariant(idScheme, form.get("pid"));

      await db.$transaction(async (db) => {
        const record = await db.contestProblem.findUnique({
          where: {
            contestId_problemId: {
              contestId,
              problemId,
            },
          },
        });

        if (!record) {
          throw new Response("Problem not found", { status: 400 });
        }

        // 获取交换的题目
        const target = await db.contestProblem.findUnique({
          where: {
            contestId_rank: {
              contestId,
              rank:
                _action === ActionType.MoveProblemUp
                  ? record.rank - 1
                  : record.rank + 1,
            },
          },
        });

        if (!target) {
          throw new Response("Cannot move problem", { status: 400 });
        }

        // 删除原来的排名
        await db.contestProblem.delete({
          where: { contestId_rank: { contestId, rank: record.rank } },
        });
        await db.contestProblem.delete({
          where: { contestId_rank: { contestId, rank: target.rank } },
        });

        // 添加新的排名
        await db.contestProblem.createMany({
          data: [
            { contestId, problemId: record.problemId, rank: target.rank },
            { contestId, problemId: target.problemId, rank: record.rank },
          ],
        });
      });

      return null;
    }

    // 更新比赛信息
    case ActionType.UpdateInformation: {
      const title = invariant(titleScheme, form.get("title"));
      const description = invariant(descriptionScheme, form.get("description"));

      // 客户端所在的时区
      const timezone = invariant(timezoneScheme, form.get("timezone"));
      const beginTime = adjustTimezone(
        invariant(datetimeStringScheme, form.get("beginTime")),
        timezone
      );
      const endTime = adjustTimezone(
        invariant(datetimeStringScheme, form.get("endTime")),
        timezone
      );

      const system = invariant(systemScheme, form.get("system"));
      const priv = form.has("private");
      const allowJoinAfterStart = form.has("joinAfterStart");
      const registrationType = invariant(
        z.nativeEnum(ContestRegistrationType),
        form.get("registrationType")
      );
      const registrationPassword =
        registrationType === "Password"
          ? invariant(weakPasswordScheme, form.get("registrationPassword"))
          : "";
      const tags = form.getAll("tag").map((tag) => invariant(tagScheme, tag));

      await db.$transaction(async (db) => {
        const contest = await db.contest.update({
          where: { id: contestId },
          data: {
            title,
            description,
            beginTime,
            endTime,
            system,
            private: priv,
            allowJoinAfterStart,
            registrationType,
            registrationPassword,
          },
          select: {
            tags: { select: { name: true } },
          },
        });

        await db.contest.update({
          where: { id: contestId },
          data: {
            tags: {
              connectOrCreate: tags
                .filter((tag) => !contest.tags.some((t) => t.name === tag))
                .map((tag) => ({
                  where: { name: tag },
                  create: { name: tag },
                })),
              disconnect: contest.tags
                .filter((tag) => !tags.includes(tag.name))
                .map((tag) => ({ name: tag.name })),
            },
          },
        });
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑比赛: ${data?.contest.title} - HITwh OJ`,
});

export default function ContestEdit() {
  const { contest } = useLoaderData<typeof loader>();

  const [registrationType, setRegistrationType] = useState(
    contest.registrationType
  );
  console.log(registrationType, contest.registrationType);
  const [tags, setTags] = useState(contest.tags.map(({ name }) => name));
  const [tag, setTag] = useState("");

  const handleRemoveTag = (name: string) =>
    setTags(tags.filter((t) => t !== name));

  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isUpdating = isActionSubmit || isActionReload;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("更新成功");
    }
  }, [isActionReload]);

  return (
    <>
      <h2>修改比赛信息</h2>

      <Form method="post" className="form-control gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">标题</span>
          </label>
          <input
            className="input input-bordered"
            type="text"
            name="title"
            defaultValue={contest.title}
            required
            disabled={isUpdating}
          />
        </div>

        <div className="form-control gap-2">
          <label className="label">
            <span className="label-text">比赛标签</span>
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
          <div className="flex gap-4">
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
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">介绍</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            name="description"
            defaultValue={contest.description}
            required
            disabled={isUpdating}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">开始时间</span>
            <span className="label-text-alt">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            name="beginTime"
            defaultValue={getDatetimeLocal(
              new Date(contest.beginTime).getTime()
            )}
            required
            disabled={isUpdating}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">结束时间</span>
            <span className="label-text-alt">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </label>
          <input
            className="input input-bordered"
            type="datetime-local"
            name="endTime"
            defaultValue={getDatetimeLocal(new Date(contest.endTime).getTime())}
            required
            disabled={isUpdating}
          />
          <input
            type="hidden"
            name="timezone"
            value={new Date().getTimezoneOffset()}
            required
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">比赛赛制</span>
          </label>
          <select
            className="select select-bordered"
            name="system"
            required
            disabled={isUpdating}
            defaultValue={contest.system}
          >
            {Object.keys(ContestSystem).map((key) => (
              <option key={key} value={key}>
                {ContestSystem[key as keyof typeof ContestSystem]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">报名方式</span>
          </label>
          <div className="flex gap-4">
            <select
              className="select select-bordered"
              name="registrationType"
              value={registrationType}
              onChange={(event) =>
                setRegistrationType(
                  event.target.value as keyof typeof ContestRegistrationType
                )
              }
              disabled={isUpdating}
            >
              <option value={ContestRegistrationType.Public}>
                允许任何人报名
              </option>
              <option value={ContestRegistrationType.Password}>
                需要填写邀请码
              </option>
              <option value={ContestRegistrationType.Disallow}>
                不允许报名
              </option>
            </select>
            {registrationType === "Password" && (
              <input
                className="input input-bordered"
                type="text"
                name="registrationPassword"
                defaultValue={contest.registrationPassword}
                disabled={isUpdating}
                placeholder="邀请码"
                required
              />
            )}
          </div>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              className="checkbox checkbox-primary"
              type="checkbox"
              name="private"
              defaultChecked={contest.private}
              disabled={isUpdating}
            />
            <span className="label-text">
              保持比赛隐藏（取消勾选之后用户可以在首页看到该比赛）
            </span>
          </label>

          <label className="label cursor-pointer justify-start gap-2">
            <input
              className="checkbox checkbox-primary"
              type="checkbox"
              name="joinAfterStart"
              defaultChecked={contest.allowJoinAfterStart}
              disabled={isUpdating}
            />
            <span className="label-text">允许比赛开始后中途加入</span>
          </label>
        </div>

        <div className="form-control w-full max-w-xs">
          <button
            className="btn btn-primary"
            type="submit"
            name="_action"
            value={ActionType.UpdateInformation}
            disabled={isUpdating}
          >
            确认更新
          </button>
        </div>
      </Form>

      <h2>修改比赛题目</h2>

      {Date.now() > new Date(contest.beginTime).getTime() && (
        <p className="alert alert-warning shadow-lg">
          如果您在比赛开始后修改题目，系统可能会出现一些奇妙的特性
        </p>
      )}

      <ProblemEditor
        problems={contest.problems.map(({ problem }) => problem)}
        createAction={ActionType.CreateProblem}
        deleteAction={ActionType.DeleteProblem}
        moveUpAction={ActionType.MoveProblemUp}
        moveDownAction={ActionType.MoveProblemDown}
      />
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

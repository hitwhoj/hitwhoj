import { useComputed } from "@preact/signals-react";
import { ContestParticipantRole } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect } from "react";
import {
  findContestParticipantRole,
  findContestStatus,
} from "~/utils/db/contest";
import { useSignalLoaderData, useSignalTransition } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { idScheme, weakPasswordScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { useToasts } from "~/utils/toast";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  if (await findContestParticipantRole(contestId, self.userId!)) {
    throw new Response("You have already registered in this contest.", {
      status: 400,
    });
  }

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      private: true,
      registrationType: true,
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  if (contest.private || contest.registrationType === "Disallow") {
    throw new Response("Registration is not allowed", { status: 403 });
  }

  return json({ contest });
}

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  await db.$transaction(async (db) => {
    if (await findContestParticipantRole(contestId, self.userId!)) {
      throw new Response("You have already registered.", { status: 400 });
    }

    const status = await findContestStatus(contestId);

    const contest = await db.contest.findUnique({
      where: { id: contestId },
      select: {
        private: true,
        registrationType: true,
        registrationPassword: true,
        allowJoinAfterStart: true,
      },
    });

    if (!contest) {
      throw new Response("Contest not found.", { status: 404 });
    }

    if (
      status !== "Pending" &&
      !(status === "Running" && contest.allowJoinAfterStart)
    ) {
      throw new Response("Registration closed", { status: 403 });
    }

    if (contest.registrationType === "Disallow") {
      throw new Response("Registration is not allowed", { status: 403 });
    }

    if (contest.registrationType === "Password") {
      const form = await request.formData();
      const password = invariant(weakPasswordScheme, form.get("password"));

      if (password !== contest.registrationPassword) {
        throw new Response("Password incorrect", { status: 403 });
      }
    }

    await db.contestParticipant.create({
      data: {
        contestId,
        userId: self.userId!,
        role: ContestParticipantRole.Contestant,
      },
    });
  });

  return redirect(`/contest/${contestId}/problem`);
}

export default function ContestRegisteration() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const contest = useComputed(() => loaderData.value.contest);

  const transition = useSignalTransition();

  const Toasts = useToasts();

  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("报名成功");
    }
  }, [transition.actionSuccess]);

  return (
    <>
      <h2>报名比赛</h2>
      {/* TODO 添加说明（下面这句话是 copilot 生成的） */}
      <p>请注意诚信参赛，不要使用任何外挂、作弊工具参赛。</p>

      <Form method="post" className="flex gap-4">
        {contest.value.registrationType === "Password" && (
          <input
            className="input input-bordered"
            placeholder="密码"
            name="password"
            disabled={transition.isRunning}
            required
          />
        )}
        <button
          className="btn btn-primary"
          type="submit"
          disabled={transition.isRunning}
        >
          同意并报名
        </button>
      </Form>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

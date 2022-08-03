import { Alert, Button, Message, Typography } from "@arco-design/web-react";
import { ContestParticipantRole } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { useEffect } from "react";
import {
  findContestParticipantRole,
  findContestStatus,
} from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);

  if (await findContestParticipantRole(contestId, self.userId!)) {
    throw new Response("You have already registered in this contest.", {
      status: 400,
    });
  }

  return null;
};

export const action: ActionFunction<Response> = async ({ request, params }) => {
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
        allowAfterRegistration: true,
        allowPublicRegistration: true,
      },
    });

    if (!contest) {
      throw new Response("Contest not found.", { status: 404 });
    }

    if (status === "Pending") {
      if (contest.private || !contest.allowPublicRegistration) {
        throw new Response("Contest does not allow public registeration", {
          status: 400,
        });
      }
    } else if (status === "Running") {
      if (
        contest.private ||
        !contest.allowPublicRegistration ||
        !contest.allowAfterRegistration
      ) {
        throw new Response("Contest is running", { status: 400 });
      }
    } else {
      throw new Response("Contest has ended", { status: 400 });
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
};

export default function ContestRegisteration() {
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionRedirect";
  const isLoading = isActionSubmit || isActionReload;

  useEffect(() => {
    if (isActionReload) {
      Message.success("报名成功");
    }
  }, [isActionReload]);

  return (
    <Typography>
      <Typography.Title heading={4}>报名比赛</Typography.Title>
      <Typography.Paragraph>
        {/* TODO 添加说明 */}
        <Alert type="warning" content="TODO: 诚信参赛" />
      </Typography.Paragraph>

      <Typography.Paragraph>
        <Form method="post">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            确认报名
          </Button>
        </Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

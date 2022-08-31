import {
  Alert,
  Button,
  Input,
  Message,
  Space,
  Typography,
} from "@arco-design/web-react";
import { ContestParticipantRole } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect } from "react";
import {
  findContestParticipantRole,
  findContestStatus,
} from "~/utils/db/contest";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { idScheme, weakPasswordScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

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
  const { contest } = useLoaderData<typeof loader>();

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
          {contest.registrationType === "Password" ? (
            <Space>
              <Input
                placeholder="密码"
                name="password"
                required
                style={{ width: 150 }}
              />
              <Button type="primary" htmlType="submit" loading={isLoading}>
                报名
              </Button>
            </Space>
          ) : (
            <Button type="primary" htmlType="submit" loading={isLoading}>
              同意并报名
            </Button>
          )}
        </Form>
      </Typography.Paragraph>
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

import { Alert, Button, Message, Typography } from "@arco-design/web-react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { useEffect } from "react";
import { invariant } from "~/utils/invariant";
import { checkContestAttendPermission } from "~/utils/permission/contest";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findSessionUid } from "~/utils/sessions";

export const loader: LoaderFunction = async ({ request, params }) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  await checkContestAttendPermission(request, contestId);

  return null;
};

export const action: ActionFunction<Response> = async ({ request, params }) => {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  await checkContestAttendPermission(request, contestId);
  const self = await findSessionUid(request);

  await db.contest.update({
    where: { id: contestId },
    data: { attendees: { connect: { id: self } } },
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

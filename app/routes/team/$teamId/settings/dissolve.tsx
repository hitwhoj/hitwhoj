import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { TeamMemberRole } from "@prisma/client";
import { Alert, Button, Checkbox, Typography } from "@arco-design/web-react";
import { useState } from "react";
import { findRequestUser } from "~/utils/permission";

export const action: ActionFunction<Response> = async ({ params, request }) => {
  const teamId = invariant(idScheme, params.teamId);
  const self = await findRequestUser(request);

  const teamMember = await db.teamMember.findUnique({
    where: { userId_teamId: { teamId, userId: self.userId! } },
    select: { role: true },
  });

  if (!teamMember) {
    throw new Response("You are not in this team", { status: 403 });
  }

  if (teamMember.role !== TeamMemberRole.Owner) {
    throw new Response("Permisson denied: only owner can dissolve team", {
      status: 403,
    });
  }

  await db.teamMember.deleteMany({ where: { teamId } });
  await db.team.delete({ where: { id: teamId } });

  return redirect(`/team`);
};

export default function DissolveTeam() {
  const [confirm, setConfirm] = useState(false);

  return (
    <Typography>
      <Typography.Title heading={4}>解散团队</Typography.Title>
      <Typography.Paragraph>
        <Alert
          type="warning"
          content="团队相关的所有比赛、题目和评测都会被删除"
        />
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Checkbox
          onChange={() => setConfirm((confirm) => !confirm)}
          checked={confirm}
        >
          我知道我在干什么
        </Checkbox>
      </Typography.Paragraph>
      <Form method="post">
        <Button
          htmlType="submit"
          type="primary"
          status="danger"
          disabled={!confirm}
        >
          解散团队
        </Button>
      </Form>
    </Typography>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

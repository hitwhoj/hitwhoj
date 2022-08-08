import { invariant } from "~/utils/invariant";
import { idScheme, reasonScheme, reportTypeScheme } from "~/utils/scheme";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Form, Input, Modal, Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";
import { ReportType } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { findRequestUser } from "~/utils/permission";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  if (!self.userId) {
    throw redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const form = await request.formData();

  const type = invariant(reportTypeScheme, form.get("type"));
  const id = invariant(idScheme, form.get("id"));
  const reason = invariant(reasonScheme, form.get("reason"));

  console.log("type", type);

  switch (type) {
    case ReportType.C: {
      const lastReport = await db.report.findFirst({
        where: {
          type: ReportType.C,
          reason,
          creatorId: self.userId,
        },
      });
      if (lastReport) {
        throw new Error("请不要提交重复的举报");
      }

      await db.report.create({
        data: {
          type: ReportType.C,
          reason,
          creator: {
            connect: {
              id: self.userId,
            },
          },
          comment: {
            connect: {
              id,
            },
          },
        },
      });

      return;
    }
    case ReportType.R: {
      const lastReport = await db.report.findFirst({
        where: {
          type: ReportType.R,
          reason,
          creatorId: self.userId,
        },
      });
      if (lastReport) {
        throw new Error("请不要提交重复的举报");
      }

      await db.report.create({
        data: {
          type: ReportType.R,
          reason,
          creator: {
            connect: {
              id: self.userId,
            },
          },
          reply: {
            connect: {
              id,
            },
          },
        },
      });

      return;
    }
  }
}

export async function loader({ params }: LoaderArgs) {
  const report = params.report;
  if (!report) {
    throw new Response("cannot report to a teapot", { status: 400 });
  }

  const type = invariant(reportTypeScheme, report[0]);
  const id = invariant(idScheme, report.slice(1, report.length), {
    status: 404,
  });

  let reportTo = "";
  let reportContent = "";
  switch (type) {
    case ReportType.C: {
      const comment = await db.comment.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });
      if (!comment) {
        throw "comment not found";
      }
      reportTo = `Comment: #${comment.id}`;
      reportContent = `@${comment.creator.nickname}: ${comment.title}`;
      break;
    }
    case ReportType.R: {
      const reply = await db.reply.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });
      if (!reply) {
        throw "reply not found";
      }
      reportTo = `Reply: #${reply.id}`;
      reportContent = `@${reply.creator.nickname}: ${reply.content}`;
      break;
    }
  }
  return json({
    id,
    type,
    reportTo,
    reportContent,
  });
}

export default function Report() {
  const { type, id, reportTo, reportContent } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  const isCreating = fetcher.state === "submitting";

  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isCreating) {
      setSubmitting(true);
    }
    if (submitting && !isCreating) {
      setVisible(true);
      setSubmitting(false);
    }
  }, [isCreating]);

  return (
    <Typography>
      {visible ? (
        <Modal
          title="Submit Report"
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
          focusLock={true}
          autoFocus={true}
        >
          举办已提交，请等待管理员审核。
        </Modal>
      ) : null}
      <Typography.Title heading={3}>开始举办</Typography.Title>
      <fetcher.Form method="post" style={{ maxWidth: 600 }}>
        <FormItem label="举报对象" layout="vertical">
          <Input id="reportTo" value={reportTo} />
          <Input id="type" name="type" value={type} hidden />
          <Input id="id" name="id" value={id.toString()} hidden />
        </FormItem>
        <FormItem label="举报内容" layout="vertical">
          <Input id="content" name="content" value={reportContent} />
        </FormItem>
        <FormItem label="举报原因" layout="vertical">
          <TextArea
            id="reason"
            name="reason"
            required
            autoSize={{
              minRows: 3,
              maxRows: 10,
            }}
          />
        </FormItem>
        <FormItem layout="vertical">
          <Button type="primary" htmlType="submit" loading={isCreating}>
            狠狠地举办捏
          </Button>
        </FormItem>
      </fetcher.Form>
    </Typography>
  );
}

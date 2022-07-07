import type { LoaderFunction } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button, Form, Input, Typography } from "@arco-design/web-react";
import { db } from "~/utils/server/db.server";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

export enum ReportType {
  Comment = "C",
  Reply = "R",
}

export type LoaderData = {
  id: number;
  type: string;
  reportTo: string;
  reportContent: string;
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const report = params.report;
  let reportTo = "";
  let reportContent = "";
  if (!report) {
    throw new Response("cannot report to a teapot", { status: 400 });
  }
  const type = report[0];
  const id = invariant(idScheme, report.slice(1, report.length), {
    status: 404,
  });
  console.log(type, id);
  if (type == ReportType.Comment) {
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
  } else if (type === ReportType.Reply) {
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
  }
  return {
    id,
    type,
    reportTo,
    reportContent,
  };
};

export default function Report() {
  const { type, id, reportTo, reportContent } = useLoaderData<LoaderData>();

  const fetcher = useFetcher();
  const isCreating = fetcher.state === "submitting";

  return (
    <Typography>
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

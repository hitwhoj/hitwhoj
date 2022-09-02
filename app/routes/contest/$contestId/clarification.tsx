import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { findRequestUser } from "~/utils/permission";
import { findContestTeam } from "~/utils/db/contest";
import { Permissions } from "~/utils/permission/permission";
import { db } from "~/utils/server/db.server";
import {
  Form,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { TableList } from "~/src/TableList";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Empty,
  List,
  Message,
  Modal,
  Popconfirm,
  Select,
  Space,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { Form as ArcoForm, Input } from "@arco-design/web-react";
const FormItem = ArcoForm.Item;
const TextArea = Input.TextArea;

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const [canReply] = await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .hasPermission(Permissions.PERM_REPLY_CONTEST_CLARIFICATION);

  const problems = await db.contestProblem.findMany({
    where: { contestId },
    select: {
      rank: true,
      problem: {
        select: {
          title: true,
        },
      },
    },
  });

  // prisma中where条件为undefined时会被忽略
  const clarifications = await db.clarification.findMany({
    where: {
      contestId: contestId,
      userId: canReply ? undefined : self.userId!,
    },
    select: {
      id: true,
      content: true,
      user: {
        select: {
          username: true,
        },
      },
      applicant: {
        select: {
          username: true,
        },
      },
      rank: true,
      resolved: true,
      createdAt: true,
      replies: {
        select: {
          replier: {
            select: {
              username: true,
            },
          },
          content: true,
          createdAt: true,
        },
      },
    },
  });

  return json({
    canReply: canReply,
    clarifications,
    problems,
  });
}

enum ActionType {
  Create = "Create",
  Reply = "Reply",
  Apply = "Apply",
  Resolve = "Resolve",
}

export default function ContestClarification() {
  const { canReply, clarifications, problems } = useLoaderData<typeof loader>();
  const [addVisible, setAddVisible] = useState(false);

  const [rank, setRank] = useState(0);

  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedClarification, setSelectedClarification] = useState(
    clarifications[0]
  );

  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  useEffect(() => {
    if (isActionSubmit) {
      Message.success("提交成功");
      setAddVisible(false);
    }
  }, [isActionSubmit]);

  useEffect(() => {
    console.log(clarifications);
    console.log(selectedClarification);

    setSelectedClarification(
      clarifications.find((c) => c.id === selectedClarification.id) ||
        clarifications[0]
    );
  }, [clarifications]);

  const fetcher = useFetcher();

  return (
    <>
      <TableList
        data={clarifications}
        columns={[
          {
            title: "#",
            render: ({ id }) => id,
            align: "center",
            minimize: true,
          },
          {
            title: "题号",
            render: ({ rank }) => String.fromCharCode(0x40 + rank),
          },
          {
            title: canReply ? "用户反馈" : "内容",
            render({ content: title }) {
              return <Space>{title}</Space>;
            },
          },
          {
            title: "状态",
            render: ({ resolved }) => (resolved ? "已解决" : "未解决"),
          },
          {
            title: "时间",
            render: ({ createdAt }) => new Date(createdAt).toLocaleString(),
          },
          ...(canReply
            ? [
                {
                  title: "用户",
                  render: (clarification: { user: { username: any } }) =>
                    clarification.user.username,
                },
                {
                  title: "申领",
                  render: (clarifications: {
                    applicant: { username: any } | null;
                  }) =>
                    clarifications.applicant
                      ? clarifications.applicant.username
                      : "无",
                },
              ]
            : []),
        ]}
        onRow={(clarification) => {
          return {
            onClick: () => {
              setDetailVisible(true);
              setSelectedClarification(clarification);
            },
          };
        }}
      />
      {!canReply && (
        <>
          <Divider />
          <Button type="primary" onClick={() => setAddVisible(true)}>
            添加反馈
          </Button>
          <Modal
            title="添加反馈"
            visible={addVisible}
            onCancel={() => setAddVisible(false)}
            style={{ width: 600 }}
            footer={null}
          >
            <Form method="post">
              <FormItem label="题目" layout="vertical" required>
                <input type="hidden" name="rank" value={rank} required />
                <Select
                  placeholder="选择题目"
                  onChange={(rank) => setRank(rank)}
                >
                  {problems.map(({ rank, problem }) => (
                    <Select.Option key={rank} value={rank}>
                      {String.fromCharCode(0x40 + rank)} - "{problem.title}"
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem label="内容" layout="vertical" required>
                <TextArea name="content" autoSize={{ minRows: 3 }} />
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  name="_action"
                  value={ActionType.Create}
                >
                  提交
                </Button>
              </FormItem>
            </Form>
          </Modal>
        </>
      )}
      <Drawer
        width={600}
        title={canReply ? "用户反馈" : "反馈详情"}
        visible={detailVisible}
        footer={null}
        onCancel={() => {
          setDetailVisible(false);
        }}
      >
        <div style={{ height: "100%", position: "relative" }}>
          <Card title={null}>
            <div>
              题号：{String.fromCharCode(0x40 + selectedClarification.rank)}
            </div>
            <div>内容：{selectedClarification.content}</div>
            <div>用户：{selectedClarification.user.username}</div>
            <div>
              时间：{new Date(selectedClarification.createdAt).toLocaleString()}
            </div>
          </Card>
          <List
            header={null}
            style={{ marginTop: 20 }}
            dataSource={selectedClarification.replies}
            render={(item) => (
              <List.Item>
                <Card title={null}>
                  <div>
                    回复人：{canReply ? item.replier.username : "比赛管理员"}
                  </div>
                  <div>回复内容：{item.content}</div>
                  <div>
                    回复时间：{new Date(item.createdAt).toLocaleString()}
                  </div>
                </Card>
              </List.Item>
            )}
            noDataElement={
              <div style={{ textAlign: "center" }}>
                <Empty
                  description={
                    canReply
                      ? "暂无管理员回复，请尽快回复"
                      : "暂无管理员回复，请耐心等候~"
                  }
                />
              </div>
            }
          ></List>
          {canReply && (
            <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
              <Form method="post" style={{}}>
                <FormItem label="回复内容" layout="vertical" required>
                  <input
                    type="hidden"
                    name="clarificationId"
                    value={selectedClarification.id}
                    required
                  />
                  <TextArea name="content" autoSize={{ minRows: 3 }} />
                </FormItem>
                <FormItem>
                  <Popconfirm
                    title="确定要申领吗?"
                    onOk={() => {
                      return new Promise<void>((resolve) => {
                        fetcher.submit(
                          {
                            _action: ActionType.Apply,
                            clarificationId:
                              selectedClarification.id.toString(),
                          },
                          { method: "post" }
                        );
                        while (fetcher.state === "submitting");
                        if (fetcher.type === "done") {
                          resolve();
                        }
                      });
                    }}
                    disabled={selectedClarification.applicant != null}
                  >
                    <Button
                      type="primary"
                      status="warning"
                      style={{ marginRight: "5px" }}
                      disabled={selectedClarification.applicant != null}
                    >
                      申领
                    </Button>
                  </Popconfirm>
                  <Popconfirm
                    title="确定要标记为已解决吗?"
                    onOk={() => {
                      fetcher.submit(
                        {
                          _action: ActionType.Resolve,
                          clarificationId: selectedClarification.id.toString(),
                        },
                        { method: "post" }
                      );
                    }}
                    disabled={selectedClarification.resolved}
                  >
                    <Button
                      type="primary"
                      status="success"
                      style={{ marginRight: "5px" }}
                      disabled={selectedClarification.resolved}
                    >
                      解决
                    </Button>
                  </Popconfirm>
                  <Button
                    type="primary"
                    htmlType="submit"
                    name="_action"
                    value={ActionType.Reply}
                    disabled={selectedClarification.resolved}
                  >
                    提交
                  </Button>
                </FormItem>
              </Form>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);

  const form = await request.formData();
  const _action = form.get("_action");

  switch (_action) {
    case ActionType.Create: {
      const rank = invariant(idScheme, form.get("rank"), { status: 400 });
      const content = invariant(contentScheme, form.get("content"), {
        status: 400,
      });

      await db.clarification.create({
        data: {
          contestId,
          userId: self.userId!,
          content,
          rank: rank,
        },
      });

      return null;
    }
    case ActionType.Reply: {
      await self
        .team(await findContestTeam(contestId))
        .contest(contestId)
        .checkPermission(Permissions.PERM_REPLY_CONTEST_CLARIFICATION);

      const clarificationId = invariant(idScheme, form.get("clarificationId"));
      const content = invariant(contentScheme, form.get("content"));

      const clarification = await db.clarification.findUnique({
        where: { id: clarificationId },
        select: { resolved: true, applicantId: true },
      });

      if (!clarification) {
        throw new Response("Clarification not found", { status: 404 });
      }

      if (clarification.resolved) {
        throw new Response("clarification already resolved", { status: 400 });
      }

      // 第一个回答的管理员会自动申领该Clarification
      if (!clarification.applicantId) {
        await db.clarification.update({
          where: { id: clarificationId },
          data: { applicantId: self.userId },
        });
      }

      await db.clarificationReply.create({
        data: {
          clarificationId,
          replierId: self.userId!,
          content,
        },
      });

      return null;
    }
    case ActionType.Apply: {
      await self
        .team(await findContestTeam(contestId))
        .contest(contestId)
        .checkPermission(Permissions.PERM_REPLY_CONTEST_CLARIFICATION);

      const clarificationId = invariant(idScheme, form.get("clarificationId"));

      const clarification = await db.clarification.findUnique({
        where: { id: clarificationId },
        select: { applicantId: true },
      });

      if (!clarification) {
        throw new Response("Clarification not found", { status: 404 });
      }

      if (clarification.applicantId) {
        throw new Response("clarification already applied", { status: 400 });
      }

      await db.clarification.update({
        where: {
          id: clarificationId,
        },
        data: {
          applicantId: self.userId!,
        },
      });

      return null;
    }
    case ActionType.Resolve: {
      await self
        .team(await findContestTeam(contestId))
        .contest(contestId)
        .checkPermission(Permissions.PERM_REPLY_CONTEST_CLARIFICATION);

      const clarificationId = invariant(idScheme, form.get("clarificationId"));

      const clarification = await db.clarification.findUnique({
        where: { id: clarificationId },
        select: { resolved: true },
      });

      if (!clarification) {
        throw new Response("Clarification not found", { status: 404 });
      }

      if (clarification.resolved) {
        throw new Response("clarification already resolved", { status: 400 });
      }

      await db.clarification.update({
        where: {
          id: clarificationId,
        },
        data: {
          resolved: true,
        },
      });

      return null;
    }
  }
}

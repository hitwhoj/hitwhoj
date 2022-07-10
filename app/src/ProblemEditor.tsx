import { Button, Input, Space } from "@arco-design/web-react";
import {
  IconDelete,
  IconDown,
  IconPlus,
  IconUp,
} from "@arco-design/web-react/icon";
import { useFetcher } from "@remix-run/react";
import type { ProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "./problem/ProblemLink";
import { TableList } from "./TableList";

type ProblemEditorOperationsProps = {
  pid: number;
  first: boolean;
  last: boolean;
  deleteAction: string;
  moveUpAction: string;
  moveDownAction: string;
};

function ProblemEditorOperations(props: ProblemEditorOperationsProps) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="pid" value={props.pid} />
      <Space>
        <Button
          type="primary"
          status="danger"
          size="mini"
          htmlType="submit"
          name="_action"
          value={props.deleteAction}
          loading={
            isUpdating &&
            fetcher.submission?.formData.get("_action") === props.deleteAction
          }
          icon={<IconDelete />}
        />
        <Button
          size="mini"
          htmlType="submit"
          name="_action"
          value={props.moveUpAction}
          disabled={props.first}
          loading={
            isUpdating &&
            fetcher.submission?.formData.get("_action") === props.moveUpAction
          }
          icon={<IconUp />}
        />
        <Button
          size="mini"
          htmlType="submit"
          name="_action"
          value={props.moveDownAction}
          disabled={props.last}
          loading={
            isUpdating &&
            fetcher.submission?.formData.get("_action") === props.moveDownAction
          }
          icon={<IconDown />}
        />
      </Space>
    </fetcher.Form>
  );
}

type ProblemEditorCreatorProps = {
  createAction: string;
};

function ProblemEditorCreator(props: ProblemEditorCreatorProps) {
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <Space direction="horizontal">
        <Input
          id="pid"
          name="pid"
          type="text"
          disabled={isCreating}
          required
          placeholder="题目 ID"
        />
        <Button
          type="primary"
          icon={<IconPlus />}
          htmlType="submit"
          name="_action"
          value={props.createAction}
          loading={isCreating}
        >
          添加捏
        </Button>
      </Space>
    </fetcher.Form>
  );
}

type ProblemEditorProps = {
  problems: ProblemListData[];
  createAction: string;
  deleteAction: string;
  moveUpAction: string;
  moveDownAction: string;
};

/**
 * 题单/比赛的题目列表编辑器
 *
 * ```jsx
 * <form method="post">
 *   <input name="pid" value={problem.id} />
 *   <input name="_action" value={createAction | deleteAction | moveUpAction | moveDownAction} />
 * </form>
 * ```
 */
export function ProblemEditor(props: ProblemEditorProps) {
  return (
    <Space direction="vertical" style={{ display: "block" }}>
      <ProblemEditorCreator createAction={props.createAction} />
      <TableList
        data={props.problems}
        columns={[
          {
            title: "#",
            render: (_, index) => index + 1,
            align: "center",
            minimize: true,
          },
          {
            title: "题目",
            render: (problem) => <ProblemLink problem={problem} />,
          },
          {
            title: "操作",
            render: (problem, index) => (
              <ProblemEditorOperations
                pid={problem.id}
                first={index === 0}
                last={index === props.problems.length - 1}
                deleteAction={props.deleteAction}
                moveUpAction={props.moveUpAction}
                moveDownAction={props.moveDownAction}
              />
            ),
            align: "center",
            minimize: true,
          },
        ]}
      />
    </Space>
  );
}

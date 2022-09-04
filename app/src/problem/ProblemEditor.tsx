import { Message } from "@arco-design/web-react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi";
import type { ProblemListData } from "~/utils/db/problem";
import { ProblemLink } from "./ProblemLink";

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
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  return (
    <fetcher.Form method="post" className="inline-flex gap-2">
      <input type="hidden" name="pid" value={props.pid} />
      <button
        className="btn btn-primary btn-error btn-sm btn-square"
        type="submit"
        name="_action"
        value={props.deleteAction}
        disabled={isLoading}
      >
        <HiOutlineTrash />
      </button>
      <button
        className="btn btn-ghost btn-sm btn-square"
        type="submit"
        name="_action"
        value={props.moveUpAction}
        disabled={props.first || isLoading}
      >
        <HiOutlineChevronUp />
      </button>
      <button
        className="btn btn-ghost btn-sm btn-square"
        type="submit"
        name="_action"
        value={props.moveDownAction}
        disabled={props.last || isLoading}
      >
        <HiOutlineChevronDown />
      </button>
    </fetcher.Form>
  );
}

type ProblemEditorCreatorProps = {
  createAction: string;
};

function ProblemEditorCreator(props: ProblemEditorCreatorProps) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  useEffect(() => {
    if (isActionReload) {
      Message.success("更新成功");
    }
  }, [isActionReload]);

  return (
    <fetcher.Form method="post" className="inline-flex gap-4">
      <input
        className="input input-bordered"
        type="number"
        name="pid"
        disabled={isLoading}
        placeholder="题目 ID"
        required
      />
      <button
        className="btn btn-primary gap-2"
        type="submit"
        name="_action"
        value={props.createAction}
        disabled={isLoading}
      >
        <HiOutlinePlus className="w-4 h-4" />
        <span>添加捏</span>
      </button>
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
    <>
      <p>
        <ProblemEditorCreator createAction={props.createAction} />
      </p>

      <p className="not-prose overflow-x-auto">
        <table className="table static w-full">
          <thead>
            <tr>
              <th className="w-16" />
              <th>题目</th>
              <th className="w-16 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {props.problems.map((problem, index) => (
              <tr key={problem.id}>
                <th className="text-center">{problem.id}</th>
                <td>
                  <ProblemLink problem={problem} />
                </td>
                <td>
                  <ProblemEditorOperations
                    pid={problem.id}
                    first={index === 0}
                    last={index === props.problems.length - 1}
                    deleteAction={props.deleteAction}
                    moveUpAction={props.moveUpAction}
                    moveDownAction={props.moveDownAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </p>
    </>
  );
}

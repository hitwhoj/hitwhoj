import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineTrash,
} from "react-icons/hi";
import type { ProblemListData } from "~/utils/db/problem";
import { useSignalFetcher } from "~/utils/hooks";
import ProblemEditorCreator from "./ProblemEditorCreator";
import { ProblemLink } from "~/src/newLink/ProblemLink";

type ProblemEditorOperationsProps = {
  pid: number;
  first: boolean;
  last: boolean;
  deleteAction: string;
  moveUpAction: string;
  moveDownAction: string;
};

function ProblemEditorOperations(props: ProblemEditorOperationsProps) {
  const fetcher = useSignalFetcher();

  return (
    <fetcher.Form method="post" className="inline-flex gap-2">
      <input type="hidden" name="pid" value={props.pid} />
      <button
        className="btn btn-primary btn-error btn-square btn-sm"
        type="submit"
        name="_action"
        value={props.deleteAction}
        disabled={fetcher.isRunning}
      >
        <HiOutlineTrash />
      </button>
      <button
        className="btn btn-ghost btn-square btn-sm"
        type="submit"
        name="_action"
        value={props.moveUpAction}
        disabled={props.first || fetcher.isRunning}
      >
        <HiOutlineChevronUp />
      </button>
      <button
        className="btn btn-ghost btn-square btn-sm"
        type="submit"
        name="_action"
        value={props.moveDownAction}
        disabled={props.last || fetcher.isRunning}
      >
        <HiOutlineChevronDown />
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
  teamId: string;
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
      <ProblemEditorCreator
        createAction={props.createAction}
        existProblem={props.problems.map(({ id }) => id)}
        teamId={props.teamId}
      />

      <table className="not-prose table w-full">
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
                <ProblemLink problem={problem} teamId={props.teamId} />
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
    </>
  );
}

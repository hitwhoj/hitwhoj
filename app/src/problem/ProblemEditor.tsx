import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineTrash,
} from "react-icons/hi";
import type { ProblemListData } from "~/utils/db/problem";
import { useSignalFetcher } from "~/utils/hooks";
import ProblemEditorCreator from "./ProblemEditorCreator";
import { ProblemLink } from "./ProblemLink";
import type { ReadonlySignal } from "@preact/signals-core";
import { useComputed, useSignal } from "@preact/signals-react";
import type { Team } from "@prisma/client";
import type { ChangeEvent } from "react";

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
  teamList: ReadonlySignal<Pick<Team, "id" | "name">[]>;
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
  // 定义状态变量teamId，第一个组件更改teamId，第二个组件根据更改的teamId获取数据
  let tmpTeamId = useSignal(0);
  const teamId = useComputed(() => {
    return tmpTeamId.value;
  });

  const selectChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    tmpTeamId.value = Number(event.target.value);
    console.log("teamId.value", teamId.value);
    console.log("tmpTeamId.value", tmpTeamId.value);
  };

  return (
    <>
      <div className="flex w-full">
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={selectChanged}
        >
          <option value={0}>公共题目</option>
          {props.teamList.value?.map((team: { id: number; name: string }) => (
            <option value={team.id} key={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <div className="divider divider-horizontal"></div>
        <ProblemEditorCreator
          teamId={teamId.value}
          createAction={props.createAction}
          existProblem={props.problems.map(({ id }) => id)}
        />
      </div>

      <table className="not-prose table w-full">
        <thead>
          <tr>
            <th className="w-16" />
            <th>已选题目</th>
            <th className="w-16 text-center">操作</th>
          </tr>
        </thead>
        <tbody>
          {props.problems.map((problem, index) => (
            <tr key={problem.id}>
              <th className="text-center">{index + 1}</th>
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
    </>
  );
}

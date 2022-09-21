import { useFetcher } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import type { LoaderData } from "~/routes/problem/data";
import { ToastContext } from "~/utils/context/toast";

type ProblemEditorCreatorProps = {
  createAction: string;
  existProblem: number[];
};

export default function ProblemEditorCreator(props: ProblemEditorCreatorProps) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;
  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("更新成功");
      setSelected(0);
      setFilter("");
    }
  }, [isActionReload]);

  const [problems, setProblems] = useState<LoaderData["problems"]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("/problem/data", { signal })
      .then((res) => res.json())
      .then(({ problems }: LoaderData) => setProblems(problems));
    return () => controller.abort();
  }, []);

  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(0);

  const placeholder = problems
    .filter(({ id }) => !props.existProblem.includes(id))
    .filter(
      (problem) =>
        `${problem.id} - ${problem.title}`.includes(filter) ||
        problem.tags.some((tag) => tag.name.includes(filter))
    )
    .slice(0, 10);

  return (
    <fetcher.Form method="post" className="inline-flex not-prose gap-4">
      <input type="hidden" name="pid" value={selected} required />
      <label className="input-group">
        <div className="dropdown">
          <input
            className="input input-bordered"
            placeholder="搜索题目..."
            value={filter}
            disabled={isLoading}
            onChange={(event) => setFilter(event.target.value)}
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu p-4 bg-base-100 shadow-2xl rounded-box"
          >
            {placeholder.length > 0 ? (
              placeholder.map((problem) => (
                <li
                  key={problem.id}
                  onClick={() => {
                    setSelected(problem.id);
                    setFilter(`${problem.id} - ${problem.title}`);
                  }}
                >
                  <span className="bg-base-100 hover:bg-base-200">
                    {problem.id} - {problem.title}
                  </span>
                </li>
              ))
            ) : (
              <li className="disabled">
                <span className="bg-base-100">无结果</span>
              </li>
            )}
          </ul>
        </div>
        <button
          className="btn gap-2"
          type="submit"
          name="_action"
          value={props.createAction}
          disabled={isLoading}
        >
          <HiOutlineSearch />
          搜索
        </button>
      </label>
    </fetcher.Form>
  );
}

import { useFetcher } from "@remix-run/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
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

  const available = useMemo(() => {
    return problems.filter(({ id }) => !props.existProblem.includes(id));
  }, [problems]);

  const datalist = useMemo(() => {
    return available.filter(
      ({ title, tags, id }) =>
        id.toString().includes(filter) ||
        title.includes(filter) ||
        tags.some(({ name }) => name.includes(filter))
    );
  }, [available, filter]);

  const selected = useMemo(() => {
    const index = filter.indexOf(".");
    if (index === -1) return 0;
    const id = parseInt(filter.slice(0, index));
    if (!available.some((p) => p.id === id)) return 0;
    return id;
  }, [filter]);

  return (
    <fetcher.Form method="post" className="not-prose inline-flex gap-4">
      <input type="hidden" name="pid" value={selected} required />
      <label className="input-group">
        <div className="dropdown">
          <input
            className="input input-bordered"
            placeholder="搜索题目..."
            list="search-problem"
            value={filter}
            disabled={isLoading}
            onChange={(event) => setFilter(event.target.value)}
          />
          <datalist id="search-problem">
            {datalist.map(({ id, title }) => (
              <option key={id} value={`${id}. ${title}`} />
            ))}
          </datalist>
        </div>
        <button
          className="btn gap-2"
          type="submit"
          name="_action"
          value={props.createAction}
          disabled={isLoading || !selected}
        >
          <HiOutlinePlus />
          添加
        </button>
      </label>
    </fetcher.Form>
  );
}

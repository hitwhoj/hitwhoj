import { useComputed, useSignal } from "@preact/signals-react";
import { useEffect } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import type { LoaderData } from "~/routes/problem/data";
import { useSignalFetcher } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";

type ProblemEditorCreatorProps = {
  createAction: string;
  existProblem: number[];
};

export default function ProblemEditorCreator(props: ProblemEditorCreatorProps) {
  const fetcher = useSignalFetcher();
  const Toasts = useToasts();

  const problems = useSignal<LoaderData["problems"]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch("/problem/data", { signal })
      .then((res) => res.json() as Promise<LoaderData>)
      .then((data) => (problems.value = data.problems));
    return () => controller.abort();
  }, []);

  const filter = useSignal("");

  const available = useComputed(() => {
    return problems.value.filter(({ id }) => !props.existProblem.includes(id));
  });

  const datalist = useComputed(() => {
    return available.value.filter(
      ({ title, tags, id }) =>
        id.toString().includes(filter.value) ||
        title.includes(filter.value) ||
        tags.some(({ name }) => name.includes(filter.value))
    );
  });

  const selected = useComputed(() => {
    const index = filter.value.indexOf(".");
    if (index === -1) return 0;
    const id = parseInt(filter.value.slice(0, index));
    if (!available.value.some((p) => p.id === id)) return 0;
    return id;
  });

  useEffect(() => {
    if (fetcher.actionSuccess) {
      filter.value = "";
      Toasts.success("更新成功");
    }
  }, [fetcher.actionSuccess]);

  return (
    <fetcher.Form method="post" className="not-prose inline-flex gap-4">
      <input type="hidden" name="pid" value={selected.value} required />
      <label className="input-group">
        <div className="dropdown">
          <input
            className="input input-bordered"
            placeholder="搜索题目..."
            list="search-problem"
            value={filter.value}
            disabled={fetcher.isRunning}
            onChange={(event) => (filter.value = event.target.value)}
          />
          <datalist id="search-problem">
            {datalist.value.map(({ id, title }) => (
              <option key={id} value={`${id}. ${title}`} />
            ))}
          </datalist>
        </div>
        <button
          className="btn gap-2"
          type="submit"
          name="_action"
          value={props.createAction}
          disabled={fetcher.isRunning || !selected}
        >
          <HiOutlinePlus />
          添加
        </button>
      </label>
    </fetcher.Form>
  );
}

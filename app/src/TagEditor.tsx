import { Message } from "@arco-design/web-react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { HiOutlineTag, HiOutlineX } from "react-icons/hi";

type TagItemProps = {
  name: string;
  deleteAction: string;
};

function TagItem(props: TagItemProps) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post" className="badge gap-1">
      <input type="hidden" name="tag" value={props.name} />
      <input type="hidden" name="_action" value={props.deleteAction} />
      {isUpdating ? <HiOutlineTag /> : <HiOutlineTag />}
      {props.name}
      <button type="submit">
        <HiOutlineX />
      </button>
    </fetcher.Form>
  );
}

type TagCreatorProps = {
  createAction: string;
};

function TagCreator(props: TagCreatorProps) {
  const fetcher = useFetcher();
  const isActionSubmit =
    fetcher.state === "submitting" && fetcher.type === "actionSubmission";
  const isActionReload =
    fetcher.state === "loading" && fetcher.type === "actionReload";
  const isLoading = isActionSubmit || isActionReload;

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isLoading) {
      Message.success("标签添加成功");
      formRef.current?.reset();
    }
  }, [isLoading]);

  return (
    <div className="inline-flex gap-4 mt-2">
      <input className="input input-bordered" type="text" name="tag" required />
      <button
        className="btn btn-primary"
        type="submit"
        name="_action"
        value={props.createAction}
      >
        添加
      </button>
    </div>
  );
}

type TagEditorProps = {
  tags: string[];
  createAction: string;
  deleteAction: string;
};

/**
 * 题目/题单/比赛编辑页面的标签修改器
 *
 * ```jsx
 * <form method="post">
 *   <input name="tag" value={tag} />
 *   <input name="_action" value={createAction | deleteAction} />
 * </form>
 * ```
 */
export function TagEditor(props: TagEditorProps) {
  return (
    <>
      <div className="inline-flex gap-2">
        {props.tags.map((name) => (
          <TagItem key={name} name={name} deleteAction={props.deleteAction} />
        ))}
      </div>
      <TagCreator createAction={props.createAction} />
    </>
  );
}

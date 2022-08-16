import { Input, Tag } from "@arco-design/web-react";
import { IconLoading, IconPlus, IconTag } from "@arco-design/web-react/icon";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { TagSpace } from "./TagSpace";

type TagItemProps = {
  name: string;
  deleteAction: string;
};

function TagItem(props: TagItemProps) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Tag
      visible={true}
      closable
      onClose={() => fetcher.submit(formRef.current)}
      icon={isUpdating ? <IconLoading /> : <IconTag />}
    >
      {props.name}
      <fetcher.Form method="post" ref={formRef}>
        <input type="hidden" name="tag" value={props.name} />
        <input type="hidden" name="_action" value={props.deleteAction} />
      </fetcher.Form>
    </Tag>
  );
}

type TagCreatorProps = {
  createAction: string;
};

function TagCreator(props: TagCreatorProps) {
  const [showInput, setShowInput] = useState(false);
  const fetcher = useFetcher();
  const isCreating = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.type === "done" && !isCreating) {
      setShowInput(false);
    }
  }, [isCreating]);

  return (
    <fetcher.Form method="post" ref={formRef}>
      <input type="hidden" name="_action" value={props.createAction} />
      {showInput ? (
        <Input
          type="text"
          size="mini"
          name="tag"
          style={{ width: "82px" }}
          autoFocus
          onBlur={(e) =>
            e.target.value
              ? fetcher.submit(formRef.current)
              : setShowInput(false)
          }
          disabled={isCreating}
          required
        />
      ) : (
        <Tag
          icon={<IconPlus />}
          style={{
            cursor: "pointer",
            width: "82px",
            textAlign: "center",
          }}
          onClick={() => setShowInput(true)}
        >
          添加标签
        </Tag>
      )}
    </fetcher.Form>
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
    <TagSpace>
      {props.tags.map((name) => (
        <TagItem key={name} name={name} deleteAction={props.deleteAction} />
      ))}
      <TagCreator createAction={props.createAction} />
    </TagSpace>
  );
}

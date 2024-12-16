import { batch, useSignal } from "@preact/signals-react";
import { HiOutlineTag, HiOutlineX } from "react-icons/hi";

type Props = {
  defaultTags: string[];
  label?: string;
  alt?: string;
  name: string;
};

/**
 * ```jsx
 * <input type="hidden" name={props.name} value={tag1} />
 * <input type="hidden" name={props.name} value={tag2} />
 * <input type="hidden" name={props.name} value={tag3} />
 * ```
 */
export function TagsEditor(props: Props) {
  const tags = useSignal(props.defaultTags);
  const tag = useSignal("");

  return (
    <div className="form-control gap-2">
      {(props.label || props.alt) && (
        <label className="label">
          {props.label && <span className="label-text">{props.label}</span>}
          {props.alt && <span className="label-text-alt">{props.alt}</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.value.map((name) => (
          <div className="badge inline-flex gap-1" key={name}>
            <input type="hidden" name={props.name} value={name} />
            <HiOutlineTag />
            {name}
            <HiOutlineX
              className="cursor-pointer"
              onClick={() => {
                tags.value = tags.value.filter((tagName) => tagName !== name);
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          className="input input-bordered"
          value={tag.value}
          onChange={(event) => (tag.value = event.target.value)}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            if (tag.value) {
              batch(() => {
                tags.value = [...tags.value, tag.value];
                tag.value = "";
              });
            }
          }}
        >
          添加标签
        </button>
      </div>
    </div>
  );
}

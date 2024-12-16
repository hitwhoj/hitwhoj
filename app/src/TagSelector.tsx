import { useSignal } from "@preact/signals-react";
import { useNavigate } from "@remix-run/react";
import { HiOutlineTag, HiOutlineX } from "react-icons/hi";

type Props = {
  allTags: string[];
  selectedTags: string[];
  action: string;
};

export function TagSelector(props: Props) {
  const tag = useSignal("");
  const tags = useSignal(props.selectedTags);
  const isOpen = useSignal(false);
  const navigate = useNavigate();

  const doNavigate = () => {
    isOpen.value = false;
    let query = "";
    for (const tag of tags.value) {
      if (query.length != 0) {
        query += ",";
      }
      query += encodeURIComponent(tag);
    }
    navigate(props.action + (query.length != 0 ? "?tags=" + query : ""));
  };

  return (
    <div className="form-control gap-2">
      <div className="flex gap-4">
        <div
          className="relative inline-block text-left"
          tabIndex={0}
          onFocus={() => {
            isOpen.value = true;
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              isOpen.value = false;
            }
          }}
        >
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <input
                type="text"
                className="input input-bordered"
                placeholder="选择标签"
                value={tag.value}
                onChange={(event) => {
                  const forbiddenCharacters = /%/g;
                  event.target.value = event.target.value.replace(forbiddenCharacters, '');
                  tag.value = event.target.value;
                }}
              />
              <div className="dropdown-content rounded-t-box rounded-b-box top-0 mt-16 h-[70vh] max-h-96 w-52 overflow-y-auto bg-base-200 text-base-content shadow-2xl">
                <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
                  {props.allTags.concat(tags.value).filter((item, index, arr) => arr.indexOf(item) === index).map(option => (
                    <label key={option} className="flex justify-start items-center px-4 py-2 text-sm btn btn-ghost normal-case">
                      <input
                        type="checkbox"
                        checked={tags.value.includes(option)}
                        onChange={() => {
                          if (tags.value.includes(option)) {
                            tags.value = tags.value.filter((tagName) => tagName !== option);
                          } else {
                            tags.value.push(option);
                          }
                          doNavigate();
                        }}
                        className="checkbox mr-2 leading-tight"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              type="button"
              disabled={tag.value.length == 0 || tags.value.includes(tag.value)}
              onClick={() => {
                tags.value.push(tag.value);
                tag.value = "";
                isOpen.value = false;
                doNavigate();
              }}
            >
              添加
            </button>
          </div>
        </div>
        <div className="flex flex-wrap my-auto gap-2">
          {tags.value.map((name) => (
            <div className="badge inline-flex gap-1" key={name}>
              <HiOutlineTag />
              {name}
              <HiOutlineX
                className="cursor-pointer"
                onClick={() => {
                  tags.value = tags.value.filter((tagName) => tagName !== name);
                  doNavigate();
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

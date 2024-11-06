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
    let query = "";
    for (const tag of tags.value) {
      if (query.length != 0) {
        query += ",";
      }
      query += tag;
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
            <input
              type="text"
              className="input input-bordered"
              placeholder="选择标签"
              value={tag.value}
              onChange={(event) => {
                const forbiddenCharacters = /[%:\/?#\[\]@!$&'()*+,;=<>\"{}|\\^~`]/g;
                event.target.value = event.target.value.replace(forbiddenCharacters, '');
                tag.value = event.target.value;
              }}
            />
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
          {isOpen.value && <div className="absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {props.allTags.concat(tags.value).filter((item, index, arr) => arr.indexOf(item) === index).map(option => (
                <label key={option} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
                    className="mr-2 leading-tight"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>}
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

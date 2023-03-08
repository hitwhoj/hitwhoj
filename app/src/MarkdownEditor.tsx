import { useFetcher } from "@remix-run/react";
import { useContext, useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { UserContext } from "~/utils/context/user";
import { Markdown } from "./Markdown";
import { VscodeEditor } from "./VscodeEditor";

type Props = {
  code: string;
  onChange: (code: string) => void;
};

export function MarkdownEditor(props: Props) {
  const [preview, setPreview] = useState(false);
  const fetcher = useFetcher();

  const [insertText, setInsertText] = useState("");

  const userId = useContext(UserContext);

  const [code, setCode] = useState(() => props.code);

  useEffect(() => {
    if (fetcher.data) {
      const markdown = `\n![image.png](/file/${fetcher.data[0]}/image.png)\n`;
      setInsertText(markdown);
    }
  }, [fetcher.data]);

  return (
    <div className="border border-base-300 rounded-box">
      <div className="tabs">
        <span
          className={`tab tab-bordered ${preview ? "" : "tab-active"}`}
          onClick={() => setPreview(false)}
        >
          代码
        </span>
        <span
          className={`tab tab-bordered ${preview ? "tab-active" : ""}`}
          onClick={() => setPreview(true)}
        >
          预览
        </span>
      </div>
      <div className="h-96 overflow-auto">
        {preview ? (
          <div className="border border-base-300 p-4">
            <Markdown>{code}</Markdown>
          </div>
        ) : (
          <div
            className="h-full"
            onPaste={(e) => {
              const image = e.clipboardData.files[0];

              if (image && image.type.indexOf("image") > -1 && userId) {
                const formData = new FormData();
                formData.append("file", e.clipboardData.files[0]);
                formData.append("_action", "uploadFile");
                fetcher.submit(formData, {
                  action: `/user/${userId}/files`,
                  encType: "multipart/form-data",
                  method: "post",
                });
              }
            }}
          >
            <VscodeEditor
              code={code}
              onChange={(code) => {
                setCode(code ?? "");
                props.onChange(code ?? "");
              }}
              language="markdown"
              insertText={insertText}
            />
          </div>
        )}
      </div>
    </div>
  );
}

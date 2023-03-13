import { Link, useFetcher } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "~/utils/context/toast";
import { UserContext } from "~/utils/context/user";
import { Markdown } from "./Markdown";
import { VscodeEditor } from "./VscodeEditor";

type Props = {
  defaultValue?: string;
  name?: string;
};

export function MarkdownEditor(props: Props) {
  const [preview, setPreview] = useState(false);
  const fetcher = useFetcher();

  const [insertText, setInsertText] = useState("");

  const userId = useContext(UserContext);
  const Toasts = useContext(ToastContext);

  const [code, setCode] = useState(() => props.defaultValue || "");

  useEffect(() => {
    if (fetcher.data) {
      const markdown = `\n![image.png](/file/${fetcher.data[0]}/image.png)\n`;
      setInsertText(markdown);
      Toasts.success("上传图片成功");
    }
  }, [fetcher.data]);

  return (
    <div className="rounded-box overflow-hidden border border-base-300">
      {props.name && (
        <textarea name={props.name} value={code} hidden readOnly />
      )}
      <div className="flex items-center">
        <div className="tabs flex-1">
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
        <div className="px-4">
          <Link to="/docs/help/markdown.md" target="_blank">
            使用说明
          </Link>
        </div>
      </div>
      <div className="h-96 overflow-auto">
        {preview ? (
          <div className="p-4">
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

                Toasts.info("上传图片中...");
              }
            }}
          >
            <VscodeEditor
              code={code}
              onChange={(code) => setCode(code ?? "")}
              language="markdown"
              insertText={insertText}
            />
          </div>
        )}
      </div>
    </div>
  );
}

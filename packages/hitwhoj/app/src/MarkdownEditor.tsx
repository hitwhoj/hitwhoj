import { useSignal } from "@preact/signals-react";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useUser } from "~/utils/context";
import { useSignalFetcher } from "~/utils/hooks";
import { useToasts } from "~/utils/toast";
import { Markdown } from "./Markdown";
import { VscodeEditor } from "./VscodeEditor";

type Props = {
  defaultValue?: string;
  name?: string;
};

/**
 * Behaves like
 *
 * ```jsx
 * <textarea name={props.name} value={props.code.value} />
 * ```
 */
export function MarkdownEditor(props: Props) {
  const fetcher = useSignalFetcher();

  const preview = useSignal(false);
  const insertText = useSignal("");

  const code = useSignal(props.defaultValue ?? "Write **Markdown** here.");

  const user = useUser();
  const Toasts = useToasts();

  useEffect(() => {
    if (fetcher.actionSuccess && fetcher.data.value) {
      const markdown = `\n![image.png](/file/${fetcher.data.value[0]}/image.png)\n`;
      insertText.value = markdown;
      Toasts.success("上传图片成功");
    }
  }, [fetcher.actionSuccess]);

  const language = useSignal("markdown");

  return (
    <div className="rounded-box border-base-300 overflow-hidden border">
      {props.name && (
        <textarea name={props.name} value={code.value} hidden readOnly />
      )}
      <div className="flex items-center">
        <div className="tabs flex-1">
          <span
            className={`tab tab-bordered ${preview.value ? "" : "tab-active"}`}
            onClick={() => (preview.value = false)}
          >
            代码
          </span>
          <span
            className={`tab tab-bordered ${preview.value ? "tab-active" : ""}`}
            onClick={() => (preview.value = true)}
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
        {preview.value ? (
          <div className="p-4">
            <Markdown>{code.value}</Markdown>
          </div>
        ) : (
          <div
            className="h-full"
            onPaste={(e) => {
              const image = e.clipboardData.files[0];

              if (image && image.type.indexOf("image") > -1 && user.value) {
                const formData = new FormData();
                formData.append("file", e.clipboardData.files[0]);
                formData.append("_action", "uploadFile");
                fetcher.submit(formData, {
                  action: `/user/${user.value}/files`,
                  encType: "multipart/form-data",
                  method: "post",
                });

                Toasts.info("上传图片中...");
              }
            }}
          >
            <VscodeEditor
              code={code}
              language={language.value}
              insertText={insertText}
            />
          </div>
        )}
      </div>
    </div>
  );
}

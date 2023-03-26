import { useEffect, useRef } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import { useSignalFetcher } from "~/utils/hooks";

type FileUploaderProps = {
  uploadAction: string;
};

/**
 * @example
 *
 * <form method="post" encType="multipart/form-data">
 *   <input name="file" type="file" multiple />
 *   <input type="hidden" name="_action" value={uploadAction} />
 * </form>
 */
export function FileUploader({ uploadAction }: FileUploaderProps) {
  const fetcher = useSignalFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetcher.actionSuccess) {
      formRef.current?.reset();
    }
  }, [fetcher.actionSuccess]);

  return (
    <fetcher.Form method="post" encType="multipart/form-data" ref={formRef}>
      <input
        type="file"
        name="file"
        multiple
        hidden
        ref={inputRef}
        onInput={() => fetcher.submit(formRef.current)}
      />
      <input type="hidden" name="_action" value={uploadAction} />
      <button
        className="btn btn-primary gap-2"
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={fetcher.isRunning}
      >
        <HiOutlineUpload />
        <span>上传文件捏</span>
      </button>
    </fetcher.Form>
  );
}

import { Button } from "@arco-design/web-react";
import { IconUpload } from "@arco-design/web-react/icon";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

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
  const fetcher = useFetcher();
  const isUploading = fetcher.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUploading) {
      formRef.current?.reset();
    }
  }, [isUploading]);

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
      <Button
        type="primary"
        icon={<IconUpload />}
        onClick={() => inputRef.current?.click()}
        loading={isUploading}
      >
        上传文件捏
      </Button>
    </fetcher.Form>
  );
}

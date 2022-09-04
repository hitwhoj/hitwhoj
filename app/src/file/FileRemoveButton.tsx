import type { File } from "@prisma/client";
import type { SerializeType } from "@remix-run/react/dist/components";
import { useFetcher } from "@remix-run/react";
import { HiOutlineTrash } from "react-icons/hi";

type FileRemoveButtonProps = {
  file: SerializeType<File>;
  deleteAction: string;
};

export function FileRemoveButton({
  file,
  deleteAction,
}: FileRemoveButtonProps) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="hidden" name="fid" value={file.id} />
      <button
        className="btn btn-error btn-square btn-sm"
        type="submit"
        name="_action"
        value={deleteAction}
        disabled={isDeleting}
      >
        <HiOutlineTrash className="w-4 h-4" />
      </button>
    </fetcher.Form>
  );
}

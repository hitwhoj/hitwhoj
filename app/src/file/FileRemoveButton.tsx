import type { File } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { HiOutlineTrash } from "react-icons/hi";

type FileRemoveButtonProps = {
  file: SerializeFrom<File>;
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
        className="btn btn-square btn-error btn-sm"
        type="submit"
        name="_action"
        value={deleteAction}
        disabled={isDeleting}
      >
        <HiOutlineTrash className="h-4 w-4" />
      </button>
    </fetcher.Form>
  );
}

import type { File } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { HiOutlineTrash } from "react-icons/hi";
import { useSignalFetcher } from "~/utils/hooks";

type FileRemoveButtonProps = {
  file: SerializeFrom<File>;
  deleteAction: string;
};

export function FileRemoveButton({
  file,
  deleteAction,
}: FileRemoveButtonProps) {
  const fetcher = useSignalFetcher();

  return (
    <fetcher.Form method="post" encType="multipart/form-data">
      <input type="hidden" name="fid" value={file.id} />
      <button
        className="btn btn-square btn-error btn-sm"
        type="submit"
        name="_action"
        value={deleteAction}
        disabled={fetcher.isRunning}
      >
        <HiOutlineTrash className="h-4 w-4" />
      </button>
    </fetcher.Form>
  );
}

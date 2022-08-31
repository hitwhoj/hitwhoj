import { Button } from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import type { File } from "@prisma/client";
import type { SerializeType } from "@remix-run/react/dist/components";
import { useFetcher } from "@remix-run/react";

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
    <fetcher.Form method="post">
      <input type="hidden" name="fid" value={file.id} />
      <Button
        type="primary"
        status="danger"
        htmlType="submit"
        name="_action"
        size="mini"
        value={deleteAction}
        loading={isDeleting}
        icon={<IconDelete />}
      />
    </fetcher.Form>
  );
}

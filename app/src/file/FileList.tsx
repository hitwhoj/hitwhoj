import type { File } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { TableList } from "../TableList";
import { FileRemoveButton } from "./FileRemoveButton";

type FileListProps = {
  files: SerializeFrom<File>[];
  deleteAction: string;
};

export function FileList({ files, deleteAction }: FileListProps) {
  return (
    <TableList
      data={files}
      columns={[
        {
          title: "文件名",
          render: ({ id, filename }) => (
            <Link to={`/file/${id}`} target="_blank">
              {filename}
            </Link>
          ),
          sorter: (a, b) =>
            a.filename > b.filename ? 1 : a.filename < b.filename ? -1 : 0,
        },
        {
          title: "文件类型",
          render: ({ mimetype }) => mimetype,
          align: "center",
          minimize: true,
        },
        {
          title: "文件大小",
          render: ({ filesize }) => `${filesize} bytes`,
          align: "center",
          minimize: true,
          sorter: (a, b) =>
            a.filesize > b.filesize ? 1 : a.filesize < b.filesize ? -1 : 0,
        },
        {
          title: "操作",
          render: (file) => (
            <FileRemoveButton deleteAction={deleteAction} file={file} />
          ),
          align: "center",
          minimize: true,
        },
      ]}
    />
  );
}

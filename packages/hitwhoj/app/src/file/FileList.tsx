import type { File } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { formatNumber } from "~/utils/tools";
import { FileRemoveButton } from "./FileRemoveButton";

type FileListProps = {
  files: SerializeFrom<File>[];
  deleteAction: string;
};

export function FileList({ files, deleteAction }: FileListProps) {
  return (
    <table className="table-compact table">
      <thead>
        <tr>
          <td>文件名</td>
          <td>文件类型</td>
          <td>文件大小</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.id}>
            <td>
              <Link to={`/file/${file.id}`} target="_blank">
                {file.filename}
              </Link>
            </td>
            <td>{file.mimetype}</td>
            <td>{formatNumber(file.filesize)}</td>
            <td>
              <FileRemoveButton file={file} deleteAction={deleteAction} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

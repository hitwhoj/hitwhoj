import { Tag } from "@arco-design/web-react";
import { IconStorage } from "@arco-design/web-react/icon";

type Props = {
  /** bytes */
  memory: number;
};

export function RecordMemory({ memory }: Props) {
  return (
    <Tag icon={<IconStorage />} checkable checked={false}>
      {memory < 0
        ? "N/A"
        : memory < 1024
        ? `${memory}B`
        : memory < 1024 * 1024
        ? `${(memory / 1024).toFixed(2)}KB`
        : memory < 1024 * 1024 * 1024
        ? `${(memory / 1024 / 1024).toFixed(2)}MB`
        : `${(memory / 1024 / 1024 / 1024).toFixed(2)}GB`}
    </Tag>
  );
}

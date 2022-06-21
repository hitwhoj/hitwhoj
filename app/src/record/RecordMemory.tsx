import { Space } from "@arco-design/web-react";
import { IconStorage } from "@arco-design/web-react/icon";

type Props = {
  memory: number;
};

export function RecordMemory({ memory }: Props) {
  return (
    <Space size="mini">
      <IconStorage />
      <span>
        {memory < 0
          ? "N/A"
          : memory < 1024
          ? `${memory}B`
          : memory < 1024 * 1024
          ? `${(memory / 1024).toFixed(2)}KB`
          : memory < 1024 * 1024 * 1024
          ? `${(memory / 1024 / 1024).toFixed(2)}MB`
          : `${(memory / 1024 / 1024 / 1024).toFixed(2)}GB`}
      </span>
    </Space>
  );
}

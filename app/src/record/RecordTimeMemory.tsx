import { Space } from "@arco-design/web-react";
import { RecordMemory } from "./RecordMemory";
import { RecordTime } from "./RecordTime";

type Props = {
  time: number;
  memory: number;
};

export function RecordTimeMemory({ time, memory }: Props) {
  return (
    <Space size="large">
      <RecordTime time={time} />
      <RecordMemory memory={memory} />
    </Space>
  );
}

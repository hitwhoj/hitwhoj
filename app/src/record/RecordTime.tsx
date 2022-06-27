import { Space } from "@arco-design/web-react";
import { IconClockCircle } from "@arco-design/web-react/icon";

type Props = {
  time: number;
};

export function RecordTime({ time }: Props) {
  return (
    <Space size="mini">
      <IconClockCircle />
      <span>{time < 0 ? "N/A" : `${time}ms`}</span>
    </Space>
  );
}

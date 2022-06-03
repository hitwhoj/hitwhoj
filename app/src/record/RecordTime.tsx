import { Tag } from "@arco-design/web-react";
import { IconClockCircle } from "@arco-design/web-react/icon";

type Props = {
  /** million seconds */
  time: number;
};

export function RecordTime({ time }: Props) {
  return (
    <Tag icon={<IconClockCircle />} checkable checked={false}>
      {time < 0 ? "N/A" : `${time}ms`}
    </Tag>
  );
}

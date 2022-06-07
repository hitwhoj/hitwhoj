import { Tag } from "@arco-design/web-react";
import { IconClockCircle } from "@arco-design/web-react/icon";

type Props = {
  time: number;
};

export function ProblemTimeLimitTag({ time }: Props) {
  return <Tag icon={<IconClockCircle />}>{(time / 1000).toFixed(1)}s</Tag>;
}

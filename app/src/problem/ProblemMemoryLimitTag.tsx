import { Tag } from "@arco-design/web-react";
import { IconStorage } from "@arco-design/web-react/icon";

type Props = {
  memory: number;
};

export function ProblemMemoryLimitTag({ memory }: Props) {
  return <Tag icon={<IconStorage />}>{memory}MiB</Tag>;
}

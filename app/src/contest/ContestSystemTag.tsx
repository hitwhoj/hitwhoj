import { Tag } from "@arco-design/web-react";
import { IconTrophy } from "@arco-design/web-react/icon";
import type { ContestSystem } from "@prisma/client";

type Props = {
  system: ContestSystem;
};

const systemColor: Record<ContestSystem, string> = {
  ACM: "blue",
  OI: "green",
  IOI: "orange",
  Homework: "grey",
};

export function ContestSystemTag({ system }: Props) {
  return (
    <Tag color={systemColor[system]} icon={<IconTrophy />}>
      {system}
    </Tag>
  );
}

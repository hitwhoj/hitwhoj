import type { ContestSystem } from "@prisma/client";
import { AiOutlineTrophy } from "react-icons/ai";

type Props = {
  system: ContestSystem;
};

const BADGE_COLOR: Record<ContestSystem, string> = {
  ACM: "badge-primary",
  OI: "badge-secondary",
  IOI: "badge-accent",
  Homework: "badge-neutral",
};

export function ContestSystemTag({ system }: Props) {
  return (
    <span className={`badge ${BADGE_COLOR[system]} gap-1`}>
      <AiOutlineTrophy />
      <span>{system}</span>
    </span>
  );
}

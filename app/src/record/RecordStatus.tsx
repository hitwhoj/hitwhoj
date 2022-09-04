import type { ReactNode } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  HiOutlineCheck,
  HiOutlineMinus,
  HiOutlineQuestionMarkCircle,
  HiOutlineX,
} from "react-icons/hi";
import type {
  JudgeStatus,
  SubtaskStatus,
  TaskStatus,
} from "~/utils/server/judge.types";

type Props = {
  status: JudgeStatus | SubtaskStatus | TaskStatus | string;
};

export function RecordStatus({ status }: Props) {
  let color: string;
  let icon: ReactNode;
  const iconsize = "w-4 h-4";

  switch (status) {
    case "Accepted": {
      color = "text-green-500";
      icon = <HiOutlineCheck className={iconsize} />;
      break;
    }

    case "Compile Error":
    case "Memory Limit Exceeded":
    case "Output Limit Exceeded":
    case "Runtime Error":
    case "System Error":
    case "Time Limit Exceeded":
    case "Unknown Error":
    case "Wrong Answer": {
      color = "text-red-500";
      icon = <HiOutlineX className={iconsize} />;
      break;
    }

    case "Compiling":
    case "Judging":
    case "Running": {
      color = "text-orange-500";
      icon = (
        <AiOutlineLoading3Quarters className={`${iconsize} animate-spin`} />
      );
      break;
    }

    case "Pending": {
      color = "text-gray-500";
      icon = (
        <AiOutlineLoading3Quarters className={`${iconsize} animate-spin`} />
      );
      break;
    }

    case "Skipped": {
      color = "text-gray-500";
      icon = <HiOutlineMinus className={iconsize} />;
      break;
    }

    default: {
      color = "";
      icon = <HiOutlineQuestionMarkCircle className={iconsize} />;
      break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-2 font-bold ${color}`}>
      {icon}
      <span>{status}</span>
    </span>
  );
}

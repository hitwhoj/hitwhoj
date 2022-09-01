import { Space } from "@arco-design/web-react";
import {
  IconCheck,
  IconClose,
  IconLoading,
  IconMinus,
} from "@arco-design/web-react/icon";
import type {
  JudgeStatus,
  SubtaskStatus,
  TaskStatus,
} from "~/utils/server/judge/judge.types";

type Props = {
  status: JudgeStatus | SubtaskStatus | TaskStatus | string;
};

export function RecordStatus({ status }: Props) {
  let color: string;
  let icon: JSX.Element;

  switch (status) {
    case "Accepted": {
      color = "green";
      icon = <IconCheck />;
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
      color = "red";
      icon = <IconClose />;
      break;
    }

    case "Compiling":
    case "Judging":
    case "Running": {
      color = "yellow";
      icon = <IconLoading />;
      break;
    }

    case "Pending": {
      color = "gray";
      icon = <IconLoading />;
      break;
    }

    case "Skipped": {
      color = "gray";
      icon = <IconMinus />;
      break;
    }

    default: {
      color = "";
      icon = <IconClose />;
      break;
    }
  }

  return (
    <Space style={{ color: `rgb(var(--${color}-6))` }}>
      {icon}
      {status}
    </Space>
  );
}

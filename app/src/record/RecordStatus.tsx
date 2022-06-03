import { Space } from "@arco-design/web-react";
import { IconCheck, IconClose, IconLoading } from "@arco-design/web-react/icon";
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
  let icon = <IconClose />;
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
      break;
    }

    case "Compiling":
    case "Judging":
    case "Running": {
      color = "yellow";
      icon = <IconLoading />;
      break;
    }

    case "Pending":
    case "Skipped": {
      color = "grey";
      break;
    }

    default: {
      color = "";
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

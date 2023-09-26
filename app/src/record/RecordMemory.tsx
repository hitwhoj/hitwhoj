import { HiOutlineChip } from "react-icons/hi";
import { formatNumber } from "~/utils/tools";

type Props = {
  memory: number;
};

export function RecordMemory({ memory }: Props) {
  return (
    <span className="badge gap-1">
      <HiOutlineChip />
      <span>
        {memory < 0
          ? "N/A"
          : memory < 1024
          ? `${formatNumber(memory)} B`
          : memory < 1024 * 1024
          ? `${formatNumber(memory / 1024)} KB`
          : memory < 1024 * 1024 * 1024
          ? `${formatNumber(memory / 1024 / 1024)} MB`
          : `${formatNumber(memory / 1024 / 1024 / 1024)} GB`}
      </span>
    </span>
  );
}

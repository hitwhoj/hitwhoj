import { HiOutlineClock } from "react-icons/hi";
import { formatNumber } from "~/utils/tools";

type Props = {
  time: number;
};

export function RecordTime({ time }: Props) {
  return (
    <span className="badge gap-1">
      <HiOutlineClock />
      <span>{time < 0 ? "N/A" : `${formatNumber(time)} ms`}</span>
    </span>
  );
}

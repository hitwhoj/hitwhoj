import { RecordMemory } from "./RecordMemory";
import { RecordTime } from "./RecordTime";

type Props = {
  time: number;
  memory: number;
};

export function RecordTimeMemory({ time, memory }: Props) {
  return (
    <span className="inline-flex gap-2">
      <RecordTime time={time} />
      <RecordMemory memory={memory} />
    </span>
  );
}

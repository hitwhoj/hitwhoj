import type { HTMLProps } from "react";
import { formatDateTime } from "~/utils/tools";

type ChatTimeProps = {
  time: string;
};

export default function ChatTime(
  _props: HTMLProps<HTMLTimeElement> & ChatTimeProps
) {
  const { time, ...props } = _props;
  const date = new Date(time);

  const format = [
    date.getHours().toString().padStart(2, "0"),
    date.getMinutes().toString().padStart(2, "0"),
    date.getSeconds().toString().padStart(2, "0"),
  ].join(":");

  return (
    <time
      className="text-gray-500 whitespace-nowrap"
      title={formatDateTime(date)}
      {...props}
    >
      {format}
    </time>
  );
}

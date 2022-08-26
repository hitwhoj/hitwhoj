import type { HTMLProps } from "react";

type ChatBubbleProps = {
  self: boolean;
};

export default function ChatBubble(
  _props: HTMLProps<HTMLDivElement> & ChatBubbleProps
) {
  const { self, ...props } = _props;

  return (
    <div
      className={`p-2 min-w-0 rounded whitespace-pre-line break-words ${
        self
          ? "bg-blue-500 text-white"
          : "bg-zinc-100 dark:bg-zinc-700 dark:text-white"
      }`}
      {...props}
    />
  );
}

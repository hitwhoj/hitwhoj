import type { HTMLProps } from "react";

type ChatMessageProps = {
  self: boolean;
};

export function ChatMessage({
  self,
  ...props
}: HTMLProps<HTMLDivElement> & ChatMessageProps) {
  return (
    <div
      className={`flex items-end gap-2 my-1 ${
        self ? "flex-row-reverse" : "flex-row"
      }`}
      {...props}
    />
  );
}

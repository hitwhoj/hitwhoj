import type { HTMLProps } from "react";

type ChatAvatarProps = {
  visible: boolean;
};

export function ChatAvatar({
  visible,
  children,
  ...props
}: HTMLProps<HTMLDivElement> & ChatAvatarProps) {
  return (
    <div className="w-[35px] h-[35px] flex-shrink-0" {...props}>
      {visible && children}
    </div>
  );
}

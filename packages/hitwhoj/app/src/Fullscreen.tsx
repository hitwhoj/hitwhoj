import type { HTMLProps } from "react";
import { useEffect } from "react";
import { menuSignal } from "~/utils/context";

type FullscreenProps = {
  visible: boolean;
};

/**
 * Making a fullscreen page (hiding left drawer)
 */
export default function Fullscreen({
  visible,
  className,
  ...props
}: FullscreenProps & HTMLProps<HTMLDivElement>) {
  // listen to visibility change
  useEffect(() => {
    menuSignal.value = !visible;
  }, [visible]);
  // recover menu drawer after leave page
  useEffect(() => () => void (menuSignal.value = true), []);

  return (
    <div
      className={`${
        visible ? "visible" : "invisible scale-75 opacity-0"
      } text-base-content fixed top-0 left-0 z-10 h-screen w-screen transition ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

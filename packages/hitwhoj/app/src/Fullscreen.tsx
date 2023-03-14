import type { HTMLProps } from "react";
import { useContext, useEffect } from "react";
import { MenuDrawerContext } from "~/utils/context/menu";

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
  const setMenuDrawer = useContext(MenuDrawerContext);

  // listen to visibility change
  useEffect(() => setMenuDrawer(!visible), [visible]);
  // recover menu drawer after leave page
  useEffect(() => () => setMenuDrawer(true), []);

  return (
    <div
      className={`${
        visible ? "visible" : "invisible scale-75 opacity-0"
      } fixed top-0 left-0 z-10 h-screen w-screen text-base-content transition ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

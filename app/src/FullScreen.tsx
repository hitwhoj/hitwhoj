import type { HTMLProps } from "react";
import { useContext, useEffect, useState } from "react";
import { MenuDrawerContext } from "~/utils/context/menu";

type FullScreenProps = {
  visible: boolean;
};

/**
 * Making a fullscreen page (hiding left drawer)
 */
export default function FullScreen({
  visible,
  className,
  ...props
}: FullScreenProps & HTMLProps<HTMLDivElement>) {
  const setMenuDrawer = useContext(MenuDrawerContext);

  // listen to visibility change
  useEffect(() => setMenuDrawer(!visible), [visible]);
  // recover menu drawer after leave page
  useEffect(() => () => setMenuDrawer(true), []);

  const [selfVisible, setSelfVisible] = useState(false);
  useEffect(() => setSelfVisible(visible), [visible]);

  return (
    <div
      className={`${
        selfVisible ? "visible" : "invisible opacity-0 scale-75"
      } fixed top-0 left-0 w-screen h-screen text-base-content z-10 transition ${
        className ?? ""
      }`}
      {...props}
    />
  );
}

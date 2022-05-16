import { lowlight } from "lowlight";
import { toH } from "hast-to-hyperscript";
import { createElement } from "react";

type Props = {
  language: string;
  children: string;
};

/** 渲染代码块 */
export default function Highlighter({ children, language }: Props) {
  const hast = lowlight.highlight(language, children);
  return toH(createElement, hast);
}

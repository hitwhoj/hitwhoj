import { Markdown } from "./Markdown";

type Props = {
  language: string;
  children: string;
};

/** 渲染代码块 */
export default function Highlighter({ children, language }: Props) {
  return <Markdown>{`\`\`\`${language}\n${children}\n\`\`\``}</Markdown>;
}

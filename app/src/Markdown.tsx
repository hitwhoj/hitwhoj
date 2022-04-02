import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Highlighter from "./Highlighter";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <Highlighter
              children={String(children).replace(/\n$/, "")}
              language={match ? match[1] : "plain"}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      children={children}
    />
  );
}

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

/** @see https://www.npmjs.com/package/rehype-sanitize */
const sanitizeOptions = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"],
    span: [...(defaultSchema.attributes?.span || []), "className", "style"],
  },
};

type Props = {
  children: string;
};

/** 渲染 Markdown */
export function Markdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkGemoji]}
      remarkRehypeOptions={{ allowDangerousHtml: true }}
      rehypePlugins={[
        rehypeKatex,
        rehypeRaw,
        rehypeHighlight,
        [rehypeSanitize, sanitizeOptions],
      ]}
      components={{
        a({ children, node, ...props }) {
          const externalLink =
            !props.href?.startsWith("#") && !props.href?.startsWith("/");
          const externalProps = externalLink && {
            target: "_blank",
            rel: "noreferrer noopener",
          };

          return (
            <a {...props} {...externalProps}>
              {children}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { Link } from "@remix-run/react";
import { HiOutlineExternalLink } from "react-icons/hi";

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
          const isExternalLink =
            !props.href?.startsWith("#") && !props.href?.startsWith("/");

          if (isExternalLink) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noreferrer noopener"
                className="link"
              >
                <span>{children}</span>
                <HiOutlineExternalLink className="inline-block" />
              </a>
            );
          } else {
            return (
              <Link to={props.href ?? "#"} className="link">
                {children}
              </Link>
            );
          }
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

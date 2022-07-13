import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { Link } from "@remix-run/react";
import { Link as AcroLink, Space, Typography } from "@arco-design/web-react";
import { IconShareExternal } from "@arco-design/web-react/icon";

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
              <AcroLink>
                <Space size="mini">
                  <a {...props} target="_blank" rel="noreferrer noopener">
                    {children}
                  </a>
                  <IconShareExternal />
                </Space>
              </AcroLink>
            );
          } else {
            return (
              <AcroLink>
                <Link to={props.href ?? "#"}>{children}</Link>
              </AcroLink>
            );
          }
        },
        p({ children, node, ...props }) {
          return (
            <Typography.Paragraph {...props}>{children}</Typography.Paragraph>
          );
        },
        h1({ children, node, ...props }) {
          return (
            <Typography.Title heading={3} {...props}>
              {children}
            </Typography.Title>
          );
        },
        h2({ children, node, ...props }) {
          return (
            <Typography.Title heading={4} {...props}>
              {children}
            </Typography.Title>
          );
        },
        h3({ children, node, ...props }) {
          return (
            <Typography.Title heading={5} {...props}>
              {children}
            </Typography.Title>
          );
        },
        h4({ children, node, ...props }) {
          return (
            <Typography.Title heading={6} {...props}>
              {children}
            </Typography.Title>
          );
        },
        h5({ children, node, ...props }) {
          return (
            <Typography.Title heading={6} {...props}>
              {children}
            </Typography.Title>
          );
        },
        h6({ children, node, ...props }) {
          return (
            <Typography.Title heading={6} {...props}>
              {children}
            </Typography.Title>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

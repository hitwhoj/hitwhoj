import { Tag } from "@arco-design/web-react";

export function CommentTag({ name }: { name: string }) {
  const color = ["orange", "green", "blue", "purple", "magenta", "gold"];

  return (
    <Tag
      size={"default"}
      color={color[Math.floor(Math.random() * color.length)]}
    >
      {name}
    </Tag>
  );
}

import { Avatar as ArcoAvatar } from "@arco-design/web-react";

type AvatarProps = {
  src: string;
  name: string;
  size?: number;
};

export function Avatar(props: AvatarProps) {
  const color = ["orange", "green", "blue", "purple", "magenta", "gold"];

  return (
    <ArcoAvatar
      style={{
        marginRight: 8,
        backgroundColor:
          props.src == ""
            ? color[Math.floor(Math.random() * color.length)]
            : undefined,
      }}
      size={props.size}
    >
      {props.src ? <img src={props.src} alt="加载失败捏" /> : props.name[0]}
    </ArcoAvatar>
  );
}

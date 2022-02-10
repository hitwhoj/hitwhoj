import { LinksFunction } from "remix";
import style from "./style.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];

type Props = {
  children: JSX.Element;
  onClick: () => void;
};

export default function Button({ children, onClick }: Props) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

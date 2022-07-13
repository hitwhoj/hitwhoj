import type { CSSProperties } from "react";
import type { ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Button } from "@arco-design/web-react";

export type likeProps = {
  id: number;
  like?: boolean | undefined;
  count: number;
  likeAction: string;
  dislikeAction?: string;
  likeElement: JSX.Element;
  dislikeElement?: JSX.Element;
  style?: CSSProperties | undefined;
  action?: ActionFunction | undefined;
  preload?: boolean | undefined; // default is true
  onClick?: ((e: Event) => void) | undefined;
};

export function Like({ props }: { props: likeProps }) {
  if (props.like === undefined) {
    props.like = false;
    props.dislikeAction = props.likeAction;
    props.dislikeElement = props.likeElement;
  }
  const fetcher = useFetcher();
  const isFetching = fetcher.state !== "idle";
  const preload = props.preload === undefined ? true : props.preload;

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="id" value={props.id} />
      <input type="hidden" />
      <Button
        type="text"
        htmlType="submit"
        name="_action"
        value={props.like ? props.dislikeAction : props.likeAction}
        disabled={isFetching}
        style={{ color: "inherit", ...props.style }}
        onClick={props.onClick}
      >
        {isFetching && preload ? (
          <div>
            {!props.like ? props.likeElement : props.dislikeElement}{" "}
            {props.count + (props.like ? -1 : 1)}
          </div>
        ) : (
          <div>
            {props.like ? props.likeElement : props.dislikeElement}{" "}
            {props.count}
          </div>
        )}
      </Button>
    </fetcher.Form>
  );
}

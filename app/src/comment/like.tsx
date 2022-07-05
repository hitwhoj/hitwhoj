import type { CSSProperties } from "react";
import type { ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

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
      <button
        type="submit"
        name="_action"
        value={props.like ? props.dislikeAction : props.likeAction}
        disabled={isFetching}
      >
        {isFetching && preload ? (
          <div style={props.style}>
            {!props.like ? props.likeElement : props.dislikeElement}{" "}
            {props.count + (props.like ? -1 : 1)}
          </div>
        ) : (
          <div style={props.style}>
            {props.like ? props.likeElement : props.dislikeElement}{" "}
            {props.count}
          </div>
        )}
      </button>
    </fetcher.Form>
  );
}

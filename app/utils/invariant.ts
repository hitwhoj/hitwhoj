import { json } from "@remix-run/node";
import type { ThrownResponse } from "@remix-run/react";
import type { ZodType, ZodTypeDef } from "zod";

export type AllThrownResponse =
  // bad request
  | ThrownResponse<400, string[]>
  // unauthorized
  | ThrownResponse<401, null>
  // forbidden
  | ThrownResponse<403, null>
  // not found
  | ThrownResponse<404, null>;

/** 判断数据是否符合 scheme */
export function invariant<
  Output,
  Def extends ZodTypeDef = ZodTypeDef,
  Input = Output
>(
  scheme: ZodType<Output, Def, Input>,
  data: unknown,
  init: ResponseInit = { status: 400 }
): Output {
  const t = scheme.safeParse(data);

  if (t.success) {
    return t.data;
  }

  if (init.status === 400) {
    throw json(
      t.error.issues.map((issue) => issue.message),
      init
    );
  }
  throw new Response(null, init);
}

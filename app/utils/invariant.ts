import { json } from "remix";
import { SafeParseReturnType } from "zod";

/**
 * Throw an error when the invariant condition fails.
 */
export function invariant<Output, Input = Output>(
  t: SafeParseReturnType<Input, Output>,
  init: ResponseInit = { status: 400 }
): Output {
  if (t.success) {
    return t.data;
  }

  throw json(t.error, init);
}

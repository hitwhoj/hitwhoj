import type { ZodType, ZodTypeDef } from "zod";

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

  throw new Response(
    t.error.issues.map((issue) => issue.message).join("\n"),
    init
  );
}

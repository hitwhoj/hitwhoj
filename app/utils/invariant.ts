export function invariant<T>(
  t: T | undefined | null,
  message: string,
  init: ResponseInit = { status: 400 }
): T {
  if (t === undefined || t === null) {
    throw new Response(message, init);
  }
  return t;
}

export function ensureId(id: string | undefined): number | undefined {
  return id && /^[1-9]\d*$/.test(id) ? Number(id) : undefined;
}

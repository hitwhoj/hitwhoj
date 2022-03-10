/**
 * Throw an error when the invariant condition fails.
 */
export function invariant<T>(
  t: T | null,
  message: string,
  init: ResponseInit = { status: 400 }
): T {
  if (t === null) {
    throw new Response(message, init);
  }
  return t;
}

/**
 * Check if the value is a valid numeric id.
 */
export function ensureNumericId<T>(id: T): number | null {
  return typeof id === "string" && /^[1-9]\d*$/.test(id) ? Number(id) : null;
}

/**
 * Check if the value is a non-empty string.
 */
export function ensureNotEmptyString<T>(s: T): string | null {
  return (typeof s === "string" && s.trim()) || null;
}

/**
 * Check if the value is a string.
 */
export function ensureString<T>(s: T): string | null {
  return typeof s === "string" ? s.trim() : null;
}

// copied from <https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression>
const EMAIL_REGEX =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

/**
 * Check if the value is a valid email string
 */
export function ensureEmail<T>(s: T): string | null {
  return typeof s === "string" && EMAIL_REGEX.test(s.trim()) ? s.trim() : null;
}

/**
 * Check if the value is a valid Date object.
 */
export function ensureDate<T>(d: T): Date | null {
  const time = ensureNumericId(d);
  return typeof time === "number" ? new Date(time) : null;
}

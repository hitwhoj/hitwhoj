/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import { Errors } from "./errors";
import crypto from "crypto";

export type Err = { error: Errors; ok: false };
export type Result<T> = Err | { result: T; ok: true };
export type EmptyResult = Err | undefined;

export function ok<T>(result: T): Result<T> {
  return { result, ok: true };
}
export function err(error: Errors): Err {
  return { error, ok: false };
}

export function randomString(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

export const and = <T> (f: (t: T) => boolean, g: (t: T) => boolean) => (t: T) => f(t) && g(t);
export const not = <T> (fn: (t: T) => boolean) => (x: T) => !fn(x);
export const is = (type: string) => (x: any) => typeof x === type;
export const any = <T> (fn: (t: T) => boolean) => (a: T[]) => a.filter(fn).length > 0;

export enum Types {
  String,
  Number,
  StringArray,
  NumberArray,
}

export function validator(type: Types) {
  switch (type) {
    case Types.String:      return is("string");
    case Types.Number:      return is("number");
    case Types.StringArray: return and(Array.isArray, not(any(not(is("string")))));
    case Types.NumberArray: return and(Array.isArray, not(any(not(is("number")))));
  }
}

export function getStatus(error: Errors): number {
  switch (error) {
    case "core/database_panicked":     return 500;
    case "core/internal_server_error": return 500;
    case "core/storage_panicked":      return 500;
    case "storage/file_not_exist":     return 404;
    case "storage/permission_denied":  return 403;
    case "common/wrong_arguments":     return 400;
    case "user/not_exist":             return 403;
    case "user/exist":                 return 403;
    case "user/login_required":        return 401;
    case "user/logout_required":       return 403;
    case "user/invalid_username":      return 403;
    case "user/password_wrong":        return 403;
    case "user/permission_denied":     return 403;
  }
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
export function encodeRFC5987ValueChars(str: string) {
  return encodeURIComponent(str)
    // Note that although RFC3986 reserves "!", RFC5987 does not,
    // so we do not need to escape it
    .replace(/['()]/g, escape) // i.e., %27 %28 %29
    .replace(/\*/g, '%2A')
    // The following are not required for percent-encoding per RFC5987,
    // so we can allow for a little better readability over the wire: |`^
    .replace(/%(?:7C|60|5E)/g, unescape);
}

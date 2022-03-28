import { z } from "zod";
import { ContestSystem } from "@prisma/client";

/**
 * Id scheme for any type of id.
 */
export const idScheme = z
  .string()
  .regex(/^[1-9]\d*$/, "Id must be a positive integer")
  .transform((x) => parseInt(x, 10));

/**
 * UUID scheme for any type of uuid.
 */
export const uuidScheme = z.string().regex(
  // this is a copilot generated regex and idk what the fuck it is
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  "UUID must be a valid UUID"
);

/**
 * Username scheme for every user
 */
export const usernameScheme = z
  .string()
  .nonempty("Username must be nonempty")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric");

/**
 * Password scheme for every user
 */
export const passwordScheme = z.string().nonempty("Password must be nonempty");

/**
 * Nickname scheme for every user
 */
export const nicknameScheme = z.string().nonempty("Nickname must be nonempty");

/**
 * Tag scheme for any tags
 */
export const tagScheme = z.string().nonempty("Tag must be nonempty");

/**
 * Title scheme for any title
 */
export const titleScheme = z.string().nonempty("Title must be nonempty");

/**
 * Description scheme for any description
 */
export const descriptionScheme = z
  .string()
  .nonempty("Description must be nonempty");

/**
 * Email scheme for HIT email only
 */
export const emailScheme = z
  .string()
  .email("Email must be a valid email")
  // TODO: maybe requires modification
  .regex(/@(?:stu\.)?hit\.edu\.cn$/, "Email must be a HIT email");

/**
 * Begin and end datetimeString, example: '2022-03-15T11:23'
 */
export const datetimeStringScheme = z
  .string()
  .nonempty("DateTime must be nonempty")
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Date must be a datetime-local")
  .transform((x) => new Date(x));

/**
 * Time zone number, unit: hour, example: 8
 */
export const timezoneScheme = z
  .string()
  .nonempty("Timezone must be nonempty")
  .regex(/^-?\d+$/, "Timezone must be a number")
  .transform((x) => parseInt(x, 10));

/**
 * Contest system
 */
export const systemScheme = z.nativeEnum(ContestSystem);

/**
 * Code scheme for submitted code
 */
export const codeScheme = z.string().nonempty("Code must be nonempty");

/**
 * Comment scheme for submitted comment
 */
export const commentScheme = z.string()
  .nonempty("Comment must be nonempty")
  .min(10, "Comment must be at least 10 characters");

/**
 * Reply scheme for submitted reply
 */
export const replyScheme = z.string()
  .nonempty("Reply must be nonempty")
  .min(5, "Reply must be at least 5 characters");

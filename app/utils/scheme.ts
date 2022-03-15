import { z } from "zod";

/**
 * Id scheme for any type of id.
 */
export const idScheme = z
  .string()
  .regex(/^[1-9]\d*$/, "Id must be a positive integer")
  .transform((x) => parseInt(x, 10));

/**
 * Username scheme for every user
 */
export const usernameScheme = z
  .string()
  .nonempty("Username must be nonempty")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric");

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
  // TODO: maybe open it
  .regex(/@(?:stu\.)?\.hit\.edu\.cn$/, "Email must be a HIT email");

/**
 * Code scheme for submitted code
 */
export const codeScheme = z.string().nonempty("Code must be nonempty");

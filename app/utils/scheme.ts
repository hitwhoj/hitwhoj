import { z } from "zod";
import { ContestSystem } from "@prisma/client";

/**
 * 数字 ID，非负整数
 *
 * @example 114514
 */
export const idScheme = z
  .string()
  .regex(/^\d+$/, "Id must be a positive integer")
  .transform((x) => parseInt(x, 10));

/**
 * UUID
 *
 * @example "f0e4c2f3-e249-4fe5-ab22-fa49aafcc74e"
 */
export const uuidScheme = z.string().regex(
  // this is a copilot generated regex and idk what the fuck it is
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  "UUID must be a valid UUID"
);

/**
 * 用户名，必须是字母数字下划线组合
 *
 * @example "Foo_Bar_233"
 */
export const usernameScheme = z
  .string()
  .nonempty("Username must be nonempty")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric");

/**
 * 用户密码
 *
 * @example "我就是用中文密码你能拿我怎么样"
 */
export const passwordScheme = z.string().nonempty("Password must be nonempty");

/**
 * 用户昵称
 *
 * @example "嘉然今天吃什么"
 */
export const nicknameScheme = z.string().nonempty("Nickname must be nonempty");

/**
 * 用户个性签名
 *
 * @example "这里是嘉然！别看我小小的，我超能吃还超可爱的哦~"
 */
export const bioScheme = z.string();

/**
 * 各类标签
 *
 * @example "math"
 * @example "算法"
 */
export const tagScheme = z.string().nonempty("Tag must be nonempty");

/**
 * 各类标题
 *
 * @example "新人求助，降雨量这题本机 AC 提交 RE"
 */
export const titleScheme = z.string().nonempty("Title must be nonempty");

/**
 * 各类简介，都可以为空
 *
 * @example "其实就是一个字符串"
 */
export const descriptionScheme = z.string();

/**
 * 个人邮箱，必须是哈工大的邮箱
 *
 * @example "alice@hit.edu.cn"
 */
export const emailScheme = z
  .string()
  .email("Email must be a valid email")
  .regex(/@(?:stu\.)?hit(?:wh|sz)?\.edu\.cn$/, "Email must be a HIT email");

/**
 * 空白字符串
 *
 * @example ""
 */
export const emptyStringScheme = z.string().length(0);

/**
 * datetime 的时间格式
 *
 * @example "2022-03-15T11:23"
 */
export const datetimeStringScheme = z
  .string()
  .nonempty("DateTime must be nonempty")
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Date must be a datetime-local")
  .transform((x) => new Date(x));

/**
 * 时区格式
 *
 * @example "8"
 */
export const timezoneScheme = z
  .string()
  .nonempty("Timezone must be nonempty")
  .regex(/^-?\d+$/, "Timezone must be a number")
  .transform((x) => parseInt(x, 10));

/**
 * 比赛的赛制
 *
 * @example "ACM"
 */
export const systemScheme = z.nativeEnum(ContestSystem);

/**
 * 提交的代码
 *
 * @example "print(\"Hello, world!\")"
 */
export const codeScheme = z.string().nonempty("Code must be nonempty");

/**
 * 提交的语言
 *
 * @example "cpp"
 * @example "py3"
 */
export const languageScheme = z
  .string()
  .nonempty("Language must be nonempty")
  .regex(/^\w+$/, "Language must be alphanumeric");

/**
 * 讨论的标题，需要十个字符以上
 *
 * @example "新人求助，降雨量这题本机 AC 提交 RE"
 */
export const commentScheme = z
  .string()
  .nonempty("Comment must be nonempty")
  .min(10, "Comment must be at least 10 characters");

/**
 * 回复的内容，8-1000字符, 支持 Markdown
 *
 * @example "# 这里是嘉然！别看我小小的，我超能吃还超可爱的哦~"
 */
export const replyContentScheme = z
  .string()
  .nonempty("Reply content must be nonempty")
  .min(8, "Reply content must be at least 8 characters")
  .max(1000, "Reply content must be at most 1000 characters");

/**
 * 回复的内容，需要十个字符以上
 */
export const replyScheme = z
  .string()
  .nonempty("Reply must be nonempty")
  .min(5, "Reply must be at least 5 characters");

export const teamNameScheme = z.string().nonempty("TeamName must be nonempty");

/**
 *
 */
export const contentScheme = z
  .string()
  .nonempty("message content must be nonempty")
  .max(255, "message content mast be less than 255 characters");

/**
 * 比赛题目编号，必须是单个大写字母
 *
 * @example "A", "Z"
 */
export const problemRankScheme = z
  .string()
  .regex(/^[A-Z]$/, "contest problem id must be a single uppercase letter");

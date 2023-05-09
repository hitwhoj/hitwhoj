import { z } from "zod";
import {
  ContestSystem,
  InvitationType,
  ReportType,
  SystemUserRole,
  ContestParticipantRole,
} from "@prisma/client";
import { TeamMemberRole } from "~/utils/domain/role";

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
 * 可空数字 ID，非负整数或空字符串（用于搜索参数）
 *
 * @example 114514 | ""
 */
export const nullableIdScheme = z.union([
  z
    .string()
    .regex(/^\d*$/, "Id must be a positive integer")
    .transform((x) => parseInt(x, 10)),
  z.null().transform(() => null),
]);

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
 * 用户密码，是 sha256 哈希过后的字符串
 *
 * @example "9107c989b1db02af062647dc602e33238a6efaf57cf2febfe5e12e09ea4610db"
 */
export const passwordScheme = z
  .string()
  .nonempty("Password must be nonempty")
  .regex(/^[0-9a-f]{64}$/, "Password must be a sha256 hash");

/**
 * 弱密码，随意的非空字符串
 *
 * @example "123456"
 */
export const weakPasswordScheme = z
  .string()
  .nonempty("Password must be nonempty");

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
 * 页码，正整数
 *
 * @example 114514
 */
export const pageScheme = z
  .string()
  .regex(/^[1-9]\d*$/, "Page must be a positive integer")
  .transform((x) => parseInt(x, 10));

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
 * 比赛成员角色
 *
 * @example "Mod"
 */
export const contestParticipantRoleScheme = z.nativeEnum(
  ContestParticipantRole
);

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

/**
 * 团队名称（非空）
 */
export const teamNameScheme = z.string().nonempty("TeamName must be nonempty");

/**
 * 团队成员角色
 *
 * @example "Member"
 */
export const teamMemberRoleScheme = z.nativeEnum(TeamMemberRole);

/**
 * 团队邀请制
 *
 * @example "FREE"
 */
export const teamInvitationScheme = z.nativeEnum(InvitationType);

/**
 * 团队邀请码（非空）
 */
export const teamInvitationCodeScheme = z
  .string()
  .nonempty("InvitationCode must be nonempty");

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
  .regex(/^[A-Z]$/, "contest problem id must be a single uppercase letter")
  .transform((x) => x.charCodeAt(0) - "A".charCodeAt(0) + 1);

export const limitScheme = z
  .string()
  .regex(/^\d+$/, "limit must be a number")
  .transform((x) => parseInt(x, 10));

/**
 * 举办的类型捏
 */
export const reportTypeScheme = z.nativeEnum(ReportType);

/**
 * 举办的理由捏
 */
export const reasonScheme = z
  .string()
  .nonempty("Reason content must be nonempty")
  .min(8, "Reason must be at least 8 characters");

/**
 * 系统角色
 *
 * [Root, Admin, User]
 */
export const roleScheme = z.nativeEnum(SystemUserRole);

/**
 * 用户的权力
 */
export const privilegeScheme = z
  .string()
  .regex(/^\d+$/, "privilege must be a number")
  .transform((x) => parseInt(x, 10));

/*
  Warnings:

  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `TeamMember` table. All the data in the column will be lost.
  - Made the column `teamId` on table `Contest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamId` on table `Problem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamId` on table `ProblemSet` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `roleName` to the `TeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
-- 丢弃 Contest 的 teamId 外键
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_teamId_fkey";

-- DropForeignKey
-- 丢弃 Problem 的 teamId 外键
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_teamId_fkey";

-- DropForeignKey
-- 丢弃 ProblemSet 的 teamId 外键
ALTER TABLE "ProblemSet" DROP CONSTRAINT "ProblemSet_teamId_fkey";

-- DropForeignKey
-- 丢弃 TeamMember 的 teamId 外键
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- AlterTable
-- 修改 Contest 模式
-- from: "teamId" INT;
-- to: "teamId" TEXT NOT NULL;
-- 原来的方式会丢弃原有的数据，我们用一种新的方式实现
-- ALTER TABLE "Contest" ALTER COLUMN "teamId" SET NOT NULL,
-- ALTER COLUMN "teamId" SET DATA TYPE TEXT;

  -- 添加 _teamId 字段，类型为 TEXT，默认全都是 NULL
  ALTER TABLE "Contest" ADD COLUMN "_teamId" TEXT;

  -- 更新 _teamId 字段的内容，将 teamId 中的非 NULL 的值写入其中
  UPDATE "Contest" SET "_teamId" = CASE
  WHEN "teamId" IS NOT NULL THEN "teamId"::text
  ELSE 'system'
  END;

  -- 修改 _teamId 字段为不允许空值
  ALTER TABLE "Contest"
  ALTER COLUMN "_teamId" SET NOT NULL;

  -- 删除原有的 teamId 字段
  ALTER TABLE "Contest"
  DROP COLUMN "teamId";

  -- 将 _teamId 字段改名为 teamId
  ALTER TABLE "Contest"
  RENAME COLUMN "_teamId" TO "teamId";

-- AlterTable
-- 与上面相同
-- ALTER TABLE "Problem" ALTER COLUMN "teamId" SET NOT NULL,
-- ALTER COLUMN "teamId" SET DATA TYPE TEXT;

  -- 添加 _teamId 字段，类型为 TEXT，默认全都是 NULL
  ALTER TABLE "Problem"
  ADD COLUMN "_teamId" TEXT;

  -- 更新 _teamId 字段的内容，将 teamId 中的非 NULL 的值写入其中
  UPDATE "Problem"
  SET "_teamId" = CASE
  WHEN "teamId" IS NOT NULL THEN "teamId"::text
  ELSE 'system'
  END;

  -- 修改 _teamId 字段为不允许空值
  ALTER TABLE "Problem"
  ALTER COLUMN "_teamId" SET NOT NULL;

  -- 删除原有的 teamId 字段
  ALTER TABLE "Problem"
  DROP COLUMN "teamId";

  -- 将 _teamId 字段改名为 teamId
  ALTER TABLE "Problem"
  RENAME COLUMN "_teamId" TO "teamId";

-- AlterTable
-- 与上面相同
-- ALTER TABLE "ProblemSet" ALTER COLUMN "teamId" SET NOT NULL,
-- ALTER COLUMN "teamId" SET DATA TYPE TEXT;

  -- 添加 _teamId 字段，类型为 TEXT，默认全都是 NULL
  ALTER TABLE "ProblemSet"
  ADD COLUMN "_teamId" TEXT;

  -- 更新 _teamId 字段的内容，将 teamId 中的非 NULL 的值写入其中
  UPDATE "ProblemSet"
  SET "_teamId" = CASE
  WHEN "teamId" IS NOT NULL THEN "teamId"::text
  ELSE 'system'
  END;

  -- 修改 _teamId 字段为不允许空值
  ALTER TABLE "ProblemSet"
  ALTER COLUMN "_teamId" SET NOT NULL;

  -- 删除原有的 teamId 字段
  ALTER TABLE "ProblemSet"
  DROP COLUMN "teamId";

  -- 将 _teamId 字段改名为 teamId
  ALTER TABLE "ProblemSet"
  RENAME COLUMN "_teamId" TO "teamId";

-- AlterTable
-- 对于 Team 表：
-- 1. 丢弃主键 id
-- 2. 将 id 字段从 INT 修改成 TEXT 类型，丢弃 DEFAULT
-- 3. 添加主键 id
-- 4. 丢弃自增列表
-- ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
-- ALTER COLUMN "id" DROP DEFAULT,
-- ALTER COLUMN "id" SET DATA TYPE TEXT,
-- ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");
-- DROP SEQUENCE "Team_id_seq";

  -- 添加一个临时字段，将原本的 id 值保存到该字段中
  ALTER TABLE "Team" ADD COLUMN "_id" TEXT;
  UPDATE "Team" SET "_id" = "id"::text;
  ALTER TABLE "Team" ALTER COLUMN "_id" SET NOT NULL;

  -- 删除原有主键、自增列和 id 字段
  ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey";
  ALTER TABLE "Team" DROP COLUMN "id";
  DROP SEQUENCE "Team_id_seq";

  -- 将临时字段重新命名为 id，并添加主键
  ALTER TABLE "Team" RENAME COLUMN "_id" TO "id";
  ALTER TABLE "Team" ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

  -- 添加默认的系统团队
  INSERT INTO "Team" ("id", "name")
  VALUES ('system', '系统默认团队');

-- AlterTable
-- 修改 TeamMember 类型
-- 1. 丢弃原来的主键
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_pkey";
-- 2. 将 role 字段修改成 roleName，保留 Owner, Admin, Member 的枚举
ALTER TABLE "TeamMember" ADD COLUMN "roleName" TEXT;
UPDATE "TeamMember" SET "roleName" = "role";
ALTER TABLE "TeamMember" ALTER COLUMN "roleName" SET NOT NULL;
ALTER TABLE "TeamMember" DROP COLUMN "role";
-- 2. 将 teamId 从 INT NOT NULL 改成 TEXT NOT NULL
ALTER TABLE "TeamMember" ADD COLUMN "_teamId" TEXT;
UPDATE "TeamMember" SET "_teamId" = "teamId"::text;
ALTER TABLE "TeamMember" ALTER COLUMN "_teamId" SET NOT NULL;
ALTER TABLE "TeamMember" DROP COLUMN "teamId";
ALTER TABLE "TeamMember" RENAME COLUMN "_teamId" TO "teamId";
-- 4. 重新添加主键
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("userId", "teamId");

-- DropEnum
-- 删除枚举类型
DROP TYPE "TeamMemberRole";

-- 为所有用户添加系统中的角色
INSERT INTO "TeamMember" ("userId", "teamId", "roleName")
SELECT "id", 'system', 'Member'
FROM "User";

-- CreateTable
-- 添加 TeamRole 表
CREATE TABLE "TeamRole" (
    "teamId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "privilege" INTEGER NOT NULL,

    CONSTRAINT "TeamRole_pkey" PRIMARY KEY ("teamId","role")
);

-- 为所有团队添加默认的 TeamRole 表
INSERT INTO "TeamRole" ("teamId", "role", "description", "privilege")
SELECT "id", 'Owner', '', -1
FROM "Team";

INSERT INTO "TeamRole" ("teamId", "role", "description", "privilege")
SELECT "id", 'Admin', '', 262143 -- (1 << 18) - 1
FROM "Team";

INSERT INTO "TeamRole" ("teamId", "role", "description", "privilege")
SELECT "id", 'Member', '', 69889 -- (1 << 0) + (1 << 8) + (1 << 12) + (1 << 16)
FROM "Team";

-- AddForeignKey
-- 添加 Problem 到 Team 的外键
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- 添加 ProblemSet 到 Team 的外键
ALTER TABLE "ProblemSet" ADD CONSTRAINT "ProblemSet_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- 添加 Contest 到 Team 的外键
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- 添加 TeamMember 到 Team 的外键
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
-- 添加 TeamMember 到 TeamRole 的外键
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_roleName_fkey" FOREIGN KEY ("teamId", "roleName") REFERENCES "TeamRole"("teamId", "role") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
-- 添加 TeamRole 到 Team 的外键
ALTER TABLE "TeamRole" ADD CONSTRAINT "TeamRole_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

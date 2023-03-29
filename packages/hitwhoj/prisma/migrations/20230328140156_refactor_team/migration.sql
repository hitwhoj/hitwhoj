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
ALTER TABLE "Contest" DROP CONSTRAINT "Contest_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ProblemSet" DROP CONSTRAINT "ProblemSet_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- AlterTable
ALTER TABLE "Contest" ALTER COLUMN "teamId" SET NOT NULL,
ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "teamId" SET NOT NULL,
ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProblemSet" ALTER COLUMN "teamId" SET NOT NULL,
ALTER COLUMN "teamId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Team_id_seq";

-- AlterTable
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_pkey",
DROP COLUMN "role",
ADD COLUMN     "roleName" TEXT NOT NULL,
ALTER COLUMN "teamId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("userId", "teamId");

-- DropEnum
DROP TYPE "TeamMemberRole";

-- CreateTable
CREATE TABLE "TeamRole" (
    "teamId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "privilege" INTEGER NOT NULL,

    CONSTRAINT "TeamRole_pkey" PRIMARY KEY ("teamId","role")
);

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSet" ADD CONSTRAINT "ProblemSet_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contest" ADD CONSTRAINT "Contest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_roleName_fkey" FOREIGN KEY ("teamId", "roleName") REFERENCES "TeamRole"("teamId", "role") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamRole" ADD CONSTRAINT "TeamRole_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

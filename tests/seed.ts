import {
  ContestSystem,
  PrismaClient,
  SystemUserRole,
  TeamMemberRole,
} from "@prisma/client";
import { passwordHash } from "~/utils/tools";

const prisma = new PrismaClient();

function hash(password: string): string {
  return passwordHash(passwordHash(password));
}

async function seed() {
  const { Su, Admin, User, Banned } = SystemUserRole;

  await prisma.user.createMany({
    data: [
      // common roles
      { username: "Alice", password: hash("alice"), role: Su },
      { username: "Bob", password: hash("bob"), role: Admin },
      { username: "Cherry", password: hash("cherry"), role: User },
      { username: "David", password: hash("david"), role: Banned },
      // copy of those roles
      { username: "Alice2", password: hash("alice2"), role: Su },
      { username: "Bob2", password: hash("bob2"), role: Admin },
      { username: "Cherry2", password: hash("cherry2"), role: User },
      { username: "David2", password: hash("david2"), role: Banned },
    ],
  });

  await prisma.problem.createMany({
    data: [
      { title: "Problem Pub", private: false },
      { title: "Problem Prv", private: true },
    ],
  });

  await prisma.team.createMany({
    data: [
      { name: "Team A" },
      { name: "Team B" },
      { name: "Team C" },
      { name: "Team D" },
    ],
  });

  await prisma.teamMember.createMany({
    data: [
      // team 1: all owners
      { teamId: 1, userId: 1, role: TeamMemberRole.Owner },
      { teamId: 1, userId: 2, role: TeamMemberRole.Owner },
      { teamId: 1, userId: 3, role: TeamMemberRole.Owner },
      { teamId: 1, userId: 4, role: TeamMemberRole.Owner },
      // team 2: all admins
      { teamId: 2, userId: 1, role: TeamMemberRole.Admin },
      { teamId: 2, userId: 2, role: TeamMemberRole.Admin },
      { teamId: 2, userId: 3, role: TeamMemberRole.Admin },
      { teamId: 2, userId: 4, role: TeamMemberRole.Admin },
      // team 3: all members
      { teamId: 3, userId: 1, role: TeamMemberRole.Member },
      { teamId: 3, userId: 2, role: TeamMemberRole.Member },
      { teamId: 3, userId: 3, role: TeamMemberRole.Member },
      { teamId: 3, userId: 4, role: TeamMemberRole.Member },
      // team 4: all guests
    ],
  });

  await prisma.problem.createMany({
    data: [
      { title: "Team A Pub", teamId: 1, private: false },
      { title: "Team A Prv", teamId: 1, private: true },
      { title: "Team B Pub", teamId: 2, private: false },
      { title: "Team B Prv", teamId: 2, private: true },
      { title: "Team C Pub", teamId: 3, private: false },
      { title: "Team C Prv", teamId: 3, private: true },
      { title: "Team D Pub", teamId: 4, private: false },
      { title: "Team D Prv", teamId: 4, private: true },
    ],
  });

  const year = 365 * 24 * 60 * 60 * 1000;
  const twoYearsAgo = new Date(Date.now() - year * 2);
  const oneYearAgo = new Date(Date.now() - year);
  const oneYearLater = new Date(Date.now() + year);
  const twoYearsLater = new Date(Date.now() + year * 2);

  // 枚举比赛状态
  for (const [status, beginTime, endTime] of [
    ["Running", oneYearAgo, oneYearLater],
    ["Not Started", oneYearLater, twoYearsLater],
    ["Ended", twoYearsAgo, oneYearAgo],
  ] as const) {
    // 枚举用户的身份
    const connect = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    for (const [type, addon] of [
      ["Mods", { mods: { connect } }],
      ["Juries", { juries: { connect } }],
      ["Attendees", { attendees: { connect } }],
      ["Guests", {}],
    ] as const) {
      // 枚举比赛是否公开
      for (const priv of [false, true]) {
        await prisma.contest.create({
          data: {
            title: `${status} Contest ${type} ${priv ? "Private" : "Public"}`,
            system: ContestSystem.ACM,
            beginTime,
            endTime,
            private: priv,
            ...addon,
          },
        });
      }
    }
  }

  await prisma.problemSet.createMany({
    data: [
      { title: "Problem Set Pub", private: false },
      { title: "Problem Set Prv", private: true },
      { title: "Team A Problem Set Pub", private: false, teamId: 1 },
      { title: "Team A Problem Set Prv", private: true, teamId: 1 },
      { title: "Team B Problem Set Pub", private: false, teamId: 2 },
      { title: "Team B Problem Set Prv", private: true, teamId: 2 },
      { title: "Team C Problem Set Pub", private: false, teamId: 3 },
      { title: "Team C Problem Set Prv", private: true, teamId: 3 },
      { title: "Team D Problem Set Pub", private: false, teamId: 4 },
      { title: "Team D Problem Set Prv", private: true, teamId: 4 },
    ],
  });
}

seed();

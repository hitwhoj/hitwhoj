import {
  ContestSystem,
  PrismaClient,
  SystemUserRole,
  TeamMemberRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      // common roles
      { username: "Alice", password: "alice", role: SystemUserRole.Su },
      { username: "Bob", password: "bob", role: SystemUserRole.Admin },
      { username: "Cherry", password: "cherry", role: SystemUserRole.User },
      { username: "David", password: "david", role: SystemUserRole.Banned },
      // copy of those roles
      { username: "Alice2", password: "alice2", role: SystemUserRole.Su },
      { username: "Bob2", password: "bob2", role: SystemUserRole.Admin },
      { username: "Cherry2", password: "cherry2", role: SystemUserRole.User },
      { username: "David2", password: "david2", role: SystemUserRole.Banned },
    ],
  });

  await prisma.problem.createMany({
    data: [
      // basic problems
      { title: "Root Prv", creatorId: 1, private: true },
      { title: "Root Pub", creatorId: 1, private: false },
      { title: "Admin Prv", creatorId: 2, private: true },
      { title: "Admin Pub", creatorId: 2, private: false },
      { title: "User Prv", creatorId: 3, private: true },
      { title: "User Pub", creatorId: 3, private: false },
      { title: "Banned Prv", creatorId: 4, private: true },
      { title: "Banned Pub", creatorId: 4, private: false },
      // copy of those problems
      { title: "Root 2 Prv", creatorId: 5, private: true },
      { title: "Root 2 Pub", creatorId: 5, private: false },
      { title: "Admin 2 Prv", creatorId: 6, private: true },
      { title: "Admin 2 Pub", creatorId: 6, private: false },
      { title: "User 2 Prv", creatorId: 7, private: true },
      { title: "User 2 Pub", creatorId: 7, private: false },
      { title: "Banned 2 Prv", creatorId: 8, private: true },
      { title: "Banned 2 Pub", creatorId: 8, private: false },
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
      { title: "Team A Prv", creatorId: 1, teamId: 1, private: true },
      { title: "Team A Pub", creatorId: 1, teamId: 1, private: false },
      { title: "Team B Prv", creatorId: 1, teamId: 2, private: true },
      { title: "Team B Pub", creatorId: 1, teamId: 2, private: false },
      { title: "Team C Prv", creatorId: 1, teamId: 3, private: true },
      { title: "Team C Pub", creatorId: 1, teamId: 3, private: false },
      { title: "Team D Prv", creatorId: 1, teamId: 4, private: true },
      { title: "Team D Pub", creatorId: 1, teamId: 4, private: false },
    ],
  });

  const year = 365 * 24 * 60 * 60 * 1000;
  const twoYearsAgo = new Date(Date.now() - year * 2);
  const oneYearAgo = new Date(Date.now() - year);
  const oneYearLater = new Date(Date.now() + year);
  const twoYearsLater = new Date(Date.now() + year * 2);

  // 枚举比赛类型
  for (const system of [
    ContestSystem.ACM,
    // ContestSystem.IOI,
    // ContestSystem.OI,
    // ContestSystem.Homework,
  ]) {
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
              title: `${status} ${system} Contest ${type} ${
                priv ? "Private" : "Public"
              }`,
              system,
              beginTime,
              endTime,
              private: priv,
              ...addon,
            },
          });
        }
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

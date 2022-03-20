import { ContestSystem, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.problemTag.createMany({
    data: [
      { name: "math" },
      { name: "algorithm" },
      { name: "easy" },
      { name: "medium" },
      { name: "hard" },
    ],
  });

  const { uid: alice } = await prisma.user.create({
    data: {
      email: "alice@hit.edu.cn",
      username: "Alice",
      password: "alice",
    },
  });

  const { uid: bob } = await prisma.user.create({
    data: {
      email: "bob@hit.edu.cn",
      username: "Bob",
      password: "bob",
    },
  });

  const { uid: charlie } = await prisma.user.create({
    data: {
      email: "charlie@hit.edu.cn",
      username: "Charlie",
      password: "charlie",
    },
  });

  const { uid: david } = await prisma.user.create({
    data: {
      email: "david@hit.edu.cn",
      username: "David",
      password: "david",
    },
  });

  const { pid: p1 } = await prisma.problem.create({
    data: {
      title: "A + B Problem",
      description:
        "## Description\n\ngive number `a` and number `b`, please output the sum of them.\n\n## Sample Input\n\n    114 514\n\n## Sample Output\n\n    628\n\n## Limits\n\n$a, b \\lt 10^9$",
      user: { connect: { uid: alice } },
      tags: { connect: [{ name: "math" }, { name: "algorithm" }] },
    },
  });

  const { pid: p2 } = await prisma.problem.create({
    data: {
      title: "A + B + C Problem",
      description:
        "# Description \n\ngive three number, output the sum of them.\n\n# Sample Input \n\n    114 514 1919\n\n# Sample Output \n\n    2547\n\n# Limits \n\n$a, b, c \\lt 10^6$",
      user: { connect: { uid: bob } },
      tags: {
        connect: [{ name: "algorithm" }, { name: "hard" }, { name: "math" }],
      },
    },
  });

  await prisma.contest.create({
    data: {
      title: "A + B Contest",
      description: "## Description\n\nThe example contest",
      beginTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 2 * 3600000),
      system: ContestSystem.ACM,

      user: { connect: { uid: charlie } },
      attendees: { connect: [{ uid: david }, { uid: alice }] },
      juries: { connect: { uid: bob } },
      tags: { create: [{ name: "test" }, { name: "do-not-attend" }] },
      problems: { connect: [{ pid: p1 }, { pid: p2 }] },
    },
  });

  await prisma.contest.create({
    data: {
      title: "A-SOUL Contest",
      description: "## Description\n\nThe A-SOUL contest",
      beginTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() + 3600000),
      system: ContestSystem.IOI,

      user: { connect: { uid: alice } },
      tags: { create: [{ name: "a-soul" }] },
      problems: { connect: [{ pid: p1 }, { pid: p2 }] },
    },
  });

  await prisma.problemSet.create({
    data: {
      title: "Math Problem List",
      description: "## Description\n\nThe example problem list",

      user: { connect: { uid: david } },
      tags: { create: [{ name: "example" }, { name: "math" }] },
      problems: { connect: [{ pid: p1 }, { pid: p2 }] },
    },
  });

  const { sid: ts1 } = await prisma.problemSet.create({
    data: {
      title: "关注嘉然，顿顿解馋",
      description: "b 站关注嘉然今天吃什么",

      user: { connect: { uid: alice } },
      tags: { create: [{ name: "spam" }, { name: "嘉然(Diana)" }] },
      problems: { connect: [{ pid: p2 }, { pid: p1 }] },
    },
  });

  await prisma.problemSet.create({
    data: {
      title: "嘉然可爱捏",
      description: "嘉然，我真的好喜欢你啊，mua~，为了你，我要听猫中毒",

      user: { connect: { uid: alice } },
      tags: { connect: [{ name: "spam" }, { name: "嘉然(Diana)" }] },
      problems: { connect: [{ pid: p2 }, { pid: p1 }] },
    },
  });

  await prisma.team.create({
    data: {
      tid: "team1",
      name: "team1",
      creatorId: alice,
    },
  });
  await prisma.teamMember.create({
    data: {
      memberId: alice,
      teamId: "team1",
    },
  });
  await prisma.teamHomework.create({
    data: {
      name: "homework1",
      ddl: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      description: "this is a homework,without doubt",
      creatorId: alice,
      teamId: "team1",
      problemsets: {
        connect: [{ sid: ts1 }],
      },
    },
  });
  await prisma.team.update({
    data: {
      homeworks: {
        create: {
          ddl: new Date(Date.now()),
          name: "作业来喽啊哈哈哈哈哈哈哈哈哈",
          description: "不想做？不想做就别想拿分",
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          creator: {
            connect: { uid: alice },
          },
          problemsets: {
            connect: [{ sid: ts1 }],
          },
        },
      },
    },
    where: {
      tid: "team1",
    },
  });
}

seed();

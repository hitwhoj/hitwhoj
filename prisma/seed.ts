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
      nickname: "Alice",
      password: "alice",
    },
  });

  const { uid: bob } = await prisma.user.create({
    data: {
      email: "bob@hit.edu.cn",
      nickname: "Bob",
      password: "bob",
    },
  });

  const { uid: charlie } = await prisma.user.create({
    data: {
      email: "charlie@hit.edu.cn",
      nickname: "Charlie",
      password: "charlie",
    },
  });

  const { uid: david } = await prisma.user.create({
    data: {
      email: "david@hit.edu.cn",
      nickname: "David",
      password: "david",
    },
  });

  const { pid: p1 } = await prisma.problem.create({
    data: {
      title: "A + B Problem",
      description:
        "## Description\n\ngive number `a` and number `b`, please output the sum of them.\n\n## Sample Input\n\n    114 514\n\n## Sample Output\n\n    628\n\n## Limits\n\n$a, b \\lt 10^9$",
      creator: { connect: { uid: alice } },
      tags: { connect: [{ name: "math" }, { name: "algorithm" }] },
    },
  });

  const { pid: p2 } = await prisma.problem.create({
    data: {
      title: "A + B + C Problem",
      description:
        "# Description \n\ngive three number, output the sum of them.\n\n# Sample Input \n\n    114 514 1919\n\n# Sample Output \n\n    2547\n\n# Limits \n\n$a, b, c \\lt 10^6$",
      creator: { connect: { uid: bob } },
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

      creator: { connect: { uid: charlie } },
      tags: { create: [{ name: "test" }, { name: "do-not-attend" }] },
      problems: { connect: [{ pid: p1 }, { pid: p2 }] },
    },
  });

  await prisma.problemList.create({
    data: {
      title: "Math Problem List",
      description: "## Description\n\nThe example problem list",

      creator: { connect: { uid: david } },
      tags: { create: [{ name: "example" }, { name: "math" }] },
      problems: { connect: [{ pid: p1 }, { pid: p2 }] },
    },
  });
}

seed();
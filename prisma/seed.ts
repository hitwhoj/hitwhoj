import { ContestSystem, PrismaClient, SystemUserRole } from "@prisma/client";

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
      role: SystemUserRole.Su,
    },
  });

  const { uid: bob } = await prisma.user.create({
    data: {
      email: "bob@hit.edu.cn",
      username: "Bob",
      password: "bob",
      role: SystemUserRole.Admin,
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
        "## Description\n\ngive number `a` and number `b`, please output the sum of them.\n\n## Sample Input\n\n    114 514\n\n## Sample Output\n\n    628\n\n## Limits\n\n$a, b \\lt 10^9$\n\n## Hint\n\n```cpp\n#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  cin >> a >> a;\n  cout << a + b << endl;\n}\n```",
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

  const { id: comment1 } = await prisma.comment.create({
    data: {
      title: "我好想做嘉然小姐的狗啊",
      user: { connect: { uid: alice } },
      tags: { create: [{ name: "P1001" }] },
    },
  });

  const { id: comment2 } = await prisma.comment.create({
    data: {
      title: "一条来自乃淇淋的评论",
      uid: alice,
      tags: { create: [{ name: "C1001" }] },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "我好想做嘉然小姐的狗啊。\n" +
        "可是嘉然小姐说她喜欢的是猫，我哭了。\n" +
        "我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。",
      uid: alice,
      commentId: comment1,
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。\n" +
        "但我还是问了嘉然小姐:“我能不能做你的狗？”\n" +
        "我知道我是注定做不了狗的。但如果她喜欢狗，我就可以一直在身边看着她了，哪怕她怀里抱着的永远都是狗。",
      commentId: comment1,
      uid: alice,
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "可是她说喜欢的是猫。\n" +
        "她现在还在看着我，还在逗我开心，是因为猫还没有出现，只有我这老鼠每天蹑手蹑脚地从洞里爬出来，远远地和她对视。\n" +
        "等她喜欢的猫来了的时候，我就该重新滚回我的洞了吧。\n" +
        "但我还是好喜欢她，她能在我还在她身边的时候多看我几眼吗？\n" +
        "嘉然小姐说接下来的每个圣诞夜都要和大家一起过[注 1]。我不知道大家指哪些人。好希望这个集合能够对我做一次胞吞。",
      commentId: comment1,
      uid: bob,
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "猫猫还在害怕嘉然小姐。\n" +
        "我会去把她爱的猫猫引来的。\n" +
        "我知道稍有不慎，我就会葬身猫口。",
      commentId: comment1,
      uid: charlie,
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "那时候嘉然小姐大概会把我的身体好好地装起来扔到门外吧。\n" +
        "那我就成了一包鼠条，嘻嘻[注 2]。\n" +
        "我希望她能把我扔得近一点，因为我还是好喜欢她。会一直喜欢下去的。",
      commentId: comment1,
      uid: david,
    },
  });

  await prisma.reply.createMany({
    data: [
      {
        content:
          "我的灵魂透过窗户向里面看去，挂着的铃铛在轻轻鸣响，嘉然小姐慵懒地靠在沙发上，表演得非常温顺的橘猫坐在她的肩膀。壁炉的火光照在她的脸庞，我冻僵的心脏在风里微微发烫。",
        commentId: comment1,
        uid: alice,
      },
      {
        content: "[注 1]: 指嘉然发表的上一篇，即12月23日的动态",
        commentId: comment1,
        uid: alice,
      },
      {
        content: "[注 2]: 此处neta了某位已毕业的vup转生后的账号名称",
        commentId: comment1,
        uid: alice,
      },
      {
        content: "Я хочу стать собакой Мисс Дианы",
        uid: alice,
        commentId: comment1,
      },
      {
        content: "I want to be Miss Diana's dog.",
        uid: bob,
        commentId: comment1,
      },
      {
        content: "私（わたし）は　ディーナちゃんの犬（いぬ）になりたい",
        uid: charlie,
        commentId: comment1,
      },
      {
        content: "So möchte ich ein Hund von Frau Diana werden.",
        uid: david,
        commentId: comment1,
      },
      {
        content: "## 嘉然，我真的好喜欢你啊，mua~，为了你，我要听猫中毒",
        uid: alice,
        commentId: comment2,
      },
      {
        content: "一条来自乃淇淋的评论",
        uid: alice,
        commentId: comment2,
      },
      {
        content: "一条来自贝极星的评论",
        uid: alice,
        commentId: comment2,
      },
    ],
  });

  await prisma.team.create({
    data: {
      tid: 1,
      name: "team1",
      creatorId: alice,
    },
  });
  await prisma.teamMember.create({
    data: {
      memberId: alice,
      teamId: 1,
    },
  });
}

seed();

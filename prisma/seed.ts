import { ContestSystem, PrismaClient, SystemUserRole } from "@prisma/client";
import { createProblemData, createUserFile } from "~/utils/files";
import { readFile } from "fs/promises";
import { File } from "@web-std/file";

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

  const { id: alice } = await prisma.user.create({
    data: {
      email: "alice@hit.edu.cn",
      username: "Alice",
      password: "alice",
      nickname: "嘉然今天吃什么",
      bio: "这里是嘉然！别看我小小的，我超能吃还超可爱的哦~",
      role: SystemUserRole.Su,
    },
  });

  const jiaran = await createUserFile(
    new File([await readFile("prisma/image/jiaran.jpg")], "avatar.jpg"),
    alice
  );

  await prisma.user.update({
    where: { id: alice },
    data: { avatar: `/file/${jiaran}/raw` },
  });

  const { id: bob } = await prisma.user.create({
    data: {
      email: "bob@hit.edu.cn",
      username: "Bob",
      password: "bob",
      nickname: "嘉然小姐的狗",
      bio: "好想做嘉然小姐的狗啊",
      role: SystemUserRole.Admin,
    },
  });

  const { id: charlie } = await prisma.user.create({
    data: {
      email: "charlie@hit.edu.cn",
      username: "Charlie",
      password: "charlie",
      nickname: "陈睿",
      bio: "bilibili 董事长兼 CEO",
    },
  });

  const { id: david } = await prisma.user.create({
    data: {
      email: "david@hit.edu.cn",
      username: "David",
      password: "david",
      nickname: "蒙古上单",
    },
  });

  const { id: p1 } = await prisma.problem.create({
    data: {
      title: "A + B Problem",
      description:
        "## Description\n\ngive number `a` and number `b`, please output the sum of them.\n\n## Sample Input\n\n    114 514\n\n## Sample Output\n\n    628\n\n## Limits\n\n$a, b \\lt 2 \\times 10^9$\n\n## Hint\n\n```cpp\n#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b << endl;\n}\n```",
      creator: { connect: { id: alice } },
      tags: { connect: [{ name: "math" }, { name: "algorithm" }] },
    },
  });

  // 上传题目数据
  await Promise.all(
    [
      new File([Buffer.from("1 2\n")], "1.in"),
      new File([Buffer.from("3\n")], "1.out"),
      new File([Buffer.from("114 514\n")], "2.in"),
      new File([Buffer.from("628\n")], "2.out"),
      new File([Buffer.from("1919 810\n")], "3.in"),
      new File([Buffer.from("2729\n")], "3.out"),
      new File([Buffer.from("114514 1919810\n")], "4.in"),
      new File([Buffer.from("2034324\n")], "4.out"),
      new File([Buffer.from("2147483647 1\n")], "5.in"),
      new File([Buffer.from("2147483648\n")], "5.out"),
      new File(
        [
          Buffer.from(
            JSON.stringify({
              type: "normal",
              subtasks: [
                {
                  score: 60,
                  tasks: [
                    { input: "1.in", output: "1.out" },
                    { input: "2.in", output: "2.out" },
                  ],
                },
                {
                  score: 20,
                  tasks: [
                    { input: "3.in", output: "3.out" },
                    { input: "4.in", output: "4.out" },
                  ],
                },
                {
                  score: 20,
                  tasks: [{ input: "5.in", output: "5.out" }],
                },
              ],
            })
          ),
        ],
        "config.json"
      ),
    ].map((file) => createProblemData(file, p1))
  );

  const { id: p2 } = await prisma.problem.create({
    data: {
      title: "A + B + C Problem",
      description:
        "## Description \n\ngive three number, output the sum of them.\n\n## Sample Input \n\n    114 514 1919\n\n## Sample Output \n\n    2547\n\n## Limits \n\n$a, b, c \\lt 10^6$\n\n## Hint\n\n$$\nE=mc^2\n$$\n\n```\nthis is text/plain\n```\n\n```\nthis is unrecognized language\n```",
      creator: { connect: { id: bob } },
      private: false,
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

      creator: { connect: { id: charlie } },
      attendees: { connect: [{ id: david }, { id: alice }] },
      juries: { connect: { id: bob } },
      tags: { create: [{ name: "test" }, { name: "do-not-attend" }] },
      problems: { connect: [{ id: p1 }, { id: p2 }] },
    },
  });

  await prisma.contest.create({
    data: {
      title: "A-SOUL Contest",
      description: "## Description\n\nThe A-SOUL contest",
      beginTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() + 3600000),
      system: ContestSystem.IOI,

      creator: { connect: { id: alice } },
      tags: { create: [{ name: "a-soul" }] },
      problems: { connect: [{ id: p1 }, { id: p2 }] },
    },
  });

  await prisma.problemSet.create({
    data: {
      title: "Math Problem List",
      description: "## Description\n\nThe example problem list",

      creator: { connect: { id: david } },
      tags: { create: [{ name: "example" }, { name: "math" }] },
      problems: { connect: [{ id: p1 }, { id: p2 }] },
    },
  });

  const { id: ts1 } = await prisma.problemSet.create({
    data: {
      title: "关注嘉然，顿顿解馋",
      description: "b 站关注嘉然今天吃什么",

      creator: { connect: { id: alice } },
      tags: { create: [{ name: "spam" }, { name: "嘉然(Diana)" }] },
      problems: { connect: [{ id: p2 }, { id: p1 }] },
    },
  });

  await prisma.problemSet.create({
    data: {
      title: "嘉然可爱捏",
      description: "嘉然，我真的好喜欢你啊，mua~，为了你，我要听猫中毒",

      creator: { connect: { id: alice } },
      tags: { connect: [{ name: "spam" }, { name: "嘉然(Diana)" }] },
      problems: { connect: [{ id: p2 }, { id: p1 }] },
    },
  });

  const { id: comment1 } = await prisma.comment.create({
    data: {
      title: "我好想做嘉然小姐的狗啊",
      creator: { connect: { id: alice } },
      tags: { create: [{ name: "P1001" }] },
    },
  });

  const { id: comment2 } = await prisma.comment.create({
    data: {
      title: "一条来自乃淇淋的评论",
      creator: { connect: { id: alice } },
      tags: { create: [{ name: "C1001" }] },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "我好想做嘉然小姐的狗啊。\n" +
        "可是嘉然小姐说她喜欢的是猫，我哭了。\n" +
        "我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。",
      creator: { connect: { id: alice } },
      comment: { connect: { id: comment1 } },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。\n" +
        "但我还是问了嘉然小姐:“我能不能做你的狗？”\n" +
        "我知道我是注定做不了狗的。但如果她喜欢狗，我就可以一直在身边看着她了，哪怕她怀里抱着的永远都是狗。",
      creator: { connect: { id: alice } },
      comment: { connect: { id: comment1 } },
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
      creator: { connect: { id: bob } },
      comment: { connect: { id: comment1 } },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "猫猫还在害怕嘉然小姐。\n" +
        "我会去把她爱的猫猫引来的。\n" +
        "我知道稍有不慎，我就会葬身猫口。",
      creator: { connect: { id: charlie } },
      comment: { connect: { id: comment1 } },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "那时候嘉然小姐大概会把我的身体好好地装起来扔到门外吧。\n" +
        "那我就成了一包鼠条，嘻嘻[注 2]。\n" +
        "我希望她能把我扔得近一点，因为我还是好喜欢她。会一直喜欢下去的。",
      creator: { connect: { id: david } },
      comment: { connect: { id: comment1 } },
    },
  });

  await prisma.reply.createMany({
    data: [
      {
        content:
          "我的灵魂透过窗户向里面看去，挂着的铃铛在轻轻鸣响，嘉然小姐慵懒地靠在沙发上，表演得非常温顺的橘猫坐在她的肩膀。壁炉的火光照在她的脸庞，我冻僵的心脏在风里微微发烫。",
        creatorId: alice,
        commentId: comment1,
      },
      {
        content: "[注 1]: 指嘉然发表的上一篇，即12月23日的动态",
        creatorId: alice,
        commentId: comment1,
      },
      {
        content: "[注 2]: 此处neta了某位已毕业的vup转生后的账号名称",
        creatorId: alice,
        commentId: comment1,
      },
      {
        content: "Я хочу стать собакой Мисс Дианы",
        creatorId: alice,
        commentId: comment1,
      },
      {
        content: "I want to be Miss Diana's dog.",
        creatorId: bob,
        commentId: comment1,
      },
      {
        content: "私（わたし）は　ディーナちゃんの犬（いぬ）になりたい",
        creatorId: charlie,
        commentId: comment1,
      },
      {
        content: "So möchte ich ein Hund von Frau Diana werden.",
        creatorId: david,
        commentId: comment1,
      },
      {
        content: "## 嘉然，我真的好喜欢你啊，mua~，为了你，我要听猫中毒",
        creatorId: alice,
        commentId: comment2,
      },
      {
        content: "一条来自乃淇淋的评论",
        creatorId: alice,
        commentId: comment2,
      },
      {
        content: "一条来自贝极星的评论",
        creatorId: alice,
        commentId: comment2,
      },
    ],
  });

  const { id: team1 } = await prisma.team.create({
    data: {
      name: "team1",
    },
  });
  await prisma.teamMember.create({
    data: {
      userId: alice,
      teamId: team1,
    },
  });
}

seed();

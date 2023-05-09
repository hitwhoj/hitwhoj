import {
  ContestParticipantRole,
  ContestSystem,
  PrismaClient,
  SystemUserRole,
  InvitationType,
} from "@prisma/client";
import { createProblemData, createUserFile } from "~/utils/files";
import { readFile } from "fs/promises";
import { passwordHash } from "~/utils/tools";
import { File } from "@remix-run/node/dist/fetch";
import { PERM_TEAM } from "~/utils/new-permission/privilege";

const prisma = new PrismaClient();

function hash(password: string): string {
  return passwordHash(passwordHash(password));
}

async function seed() {
  const { id: alice } = await prisma.user.create({
    data: {
      email: "alice@hit.edu.cn",
      username: "Alice",
      password: hash("alice"),
      nickname: "嘉然今天吃什么",
      bio: "这里是嘉然！别看我小小的，我超能吃还超可爱的哦~",
      role: SystemUserRole.Root,
    },
  });

  const jiaran = await createUserFile(
    new File([await readFile("prisma/image/jiaran.jpg")], "avatar.jpg"),
    alice
  );

  await prisma.user.update({
    where: { id: alice },
    data: { avatar: `/file/${jiaran}/avatar.jpg` },
  });

  const { id: bob } = await prisma.user.create({
    data: {
      email: "bob@hit.edu.cn",
      username: "Bob",
      password: hash("bob"),
      nickname: "嘉然小姐的狗",
      bio: "好想做嘉然小姐的狗啊",
      role: SystemUserRole.Admin,
    },
  });

  const { id: cherry } = await prisma.user.create({
    data: {
      email: "cherry@hit.edu.cn",
      username: "Cherry",
      password: hash("cherry"),
      nickname: "陈睿",
      bio: "喜欢的话就坚持吧",
    },
  });

  const chenrui = await createUserFile(
    new File([await readFile("prisma/image/cherry.png")], "avatar.png"),
    cherry
  );

  await prisma.user.update({
    where: { id: cherry },
    data: { avatar: `/file/${chenrui}/avatar.png` },
  });

  const { id: david } = await prisma.user.create({
    data: {
      email: "david@hit.edu.cn",
      username: "David",
      password: hash("david"),
      nickname: "蒙古上单",
      role: SystemUserRole.User,
    },
  });

  await prisma.user.createMany({
    data: [
      {
        username: "Alice2",
        password: hash("alice2"),
        role: SystemUserRole.Root,
      },
      { username: "Bob2", password: hash("bob2"), role: SystemUserRole.Admin },
      {
        username: "Cherry2",
        password: hash("cherry2"),
        role: SystemUserRole.User,
      },
      {
        username: "David2",
        password: hash("david2"),
        role: SystemUserRole.User,
      },
    ],
  });
  const { id: team1 } = await prisma.team.create({
    data: {
      id: "1",
      name: "system",
    },
  });
  await prisma.teamRole.create({
    data: {
      teamId: team1,
      role: "Owner",
      description: "",
      privilege: PERM_TEAM.PERM_OWNER,
    },
  });
  await prisma.teamRole.create({
    data: {
      teamId: team1,
      role: "Admin",
      description: "",
      privilege: PERM_TEAM.PERM_ADMIN,
    },
  });
  await prisma.teamRole.create({
    data: {
      teamId: team1,
      role: "Member",
      description: "",
      privilege: PERM_TEAM.PERM_MEMBER,
    },
  });
  await prisma.teamMember.create({
    data: {
      userId: alice,
      teamId: team1,
      roleName: "Owner",
    },
  });
  await prisma.teamMember.create({
    data: {
      userId: bob,
      teamId: team1,
      roleName: "Admin",
    },
  });
  await prisma.teamMember.create({
    data: {
      userId: cherry,
      teamId: team1,
      roleName: "Member",
    },
  });
  await prisma.team.create({
    data: {
      id: "2",
      name: "team2",
      invitationType: InvitationType.CODE,
      invitationCode: "114514",
    },
  });
  const { id: p1 } = await prisma.problem.create({
    data: {
      teamId: team1,
      title: "A + B Problem",
      description: `
## Description

give number \`a\` and number \`b\`, please output the sum of them.

## Sample Input

    114 514

## Sample Output

    628

## Limits

$a, b \\lt 2 \\times 10^9$

## Hint

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
  int a, b;
  cin >> a >> b;
  cout << a + b << endl;
}
\`\`\`
`,
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
              type: "default",
              time: 1000,
              memory: 256000000,
              subtasks: [
                {
                  score: 60,
                  cases: [
                    { input: "1.in", output: "1.out" },
                    { input: "2.in", output: "2.out" },
                  ],
                },
                {
                  score: 20,
                  cases: [
                    { input: "3.in", output: "3.out" },
                    { input: "4.in", output: "4.out" },
                  ],
                },
                {
                  score: 20,
                  cases: [{ input: "5.in", output: "5.out" }],
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
      teamId: team1,
      title: "A + B + C Problem",
      description: `
## Description

give number \`a\`, \`b\` and \`c\`, please output the sum of them.

## Sample Input

    114 514 1919

## Sample Output

    2547

## Limits

$a, b, c \\lt 2 \\times 10^9$

## Hint

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
  int a, b, c;
  cin >> a >> b >> c;
  cout << a + b + c << endl;
}
\`\`\`

\`\`\`whatthefuck
this is language whatthefuck
\`\`\`

~~~我是嘉然
这是我是嘉然语言
~~~
`,
      private: false,
    },
  });

  await prisma.contest.create({
    data: {
      teamId: team1,
      title: "A + B Contest",
      description: "## Description\n\nThe example contest",
      beginTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 2 * 3600000),
      system: ContestSystem.ACM,
      participants: {
        create: [
          { userId: cherry, role: ContestParticipantRole.Mod },
          { userId: bob, role: ContestParticipantRole.Jury },
          { userId: david, role: ContestParticipantRole.Contestant },
          { userId: alice, role: ContestParticipantRole.Contestant },
        ],
      },
      problems: {
        create: [
          { rank: 1, problemId: p1 },
          { rank: 2, problemId: p2 },
        ],
      },
    },
  });

  await prisma.contest.create({
    data: {
      teamId: team1,
      title: "A-SOUL Contest",
      description: "## Description\n\nThe A-SOUL contest",
      beginTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() + 3600000),
      system: ContestSystem.IOI,
      allowJoinAfterStart: true,
      participants: {
        create: [
          { userId: alice, role: ContestParticipantRole.Mod },
          { userId: cherry, role: ContestParticipantRole.Contestant },
        ],
      },
      problems: {
        create: [
          { rank: 1, problemId: p2 },
          { rank: 2, problemId: p1 },
        ],
      },
    },
  });

  await prisma.problemSet.create({
    data: {
      teamId: team1,
      title: "Math Problem List",
      description: "## Description\n\nThe example problem list",

      problems: {
        create: [
          { problemId: p1, rank: 1 },
          { problemId: p2, rank: 2 },
        ],
      },
    },
  });

  await prisma.problemSet.create({
    data: {
      teamId: team1,
      title: "关注嘉然，顿顿解馋",
      description: "b 站关注嘉然今天吃什么",

      problems: {
        create: [
          { problemId: p2, rank: 1 },
          { problemId: p1, rank: 2 },
        ],
      },
    },
  });

  await prisma.problemSet.create({
    data: {
      teamId: team1,
      title: "嘉然可爱捏",
      description: "嘉然，我真的好喜欢你啊，mua~，为了你，我要听猫中毒",

      problems: {
        create: [{ problemId: p2, rank: 1 }],
      },
    },
  });

  const { id: commentTag1 } = await prisma.commentTag.create({
    data: {
      name: "P1001",
    },
  });

  const { id: commentTag2 } = await prisma.commentTag.create({
    data: {
      name: "C1001",
    },
  });

  const { id: comment1 } = await prisma.comment.create({
    data: {
      title: "我好想做嘉然小姐的狗啊",
      content:
        "# 我好想做嘉然小姐的狗啊。\n\r" +
        "可是嘉然小姐说她喜欢的是猫，我哭了。\n\r" +
        "我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。\n\r" +
        "## 我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。\n\r" +
        "但我还是问了嘉然小姐:“我能不能做你的狗？”\n\r" +
        "我知道我是注定做不了狗的。但如果她喜欢狗，我就可以一直在身边看着她了，哪怕她怀里抱着的永远都是狗。\n\r" +
        "## 可是她说喜欢的是猫。\n\r" +
        "她现在还在看着我，还在逗我开心，是因为猫还没有出现，只有我这老鼠每天蹑手蹑脚地从洞里爬出来，远远地和她对视。\n\r" +
        "等她喜欢的猫来了的时候，我就该重新滚回我的洞了吧。\n\r" +
        "但我还是好喜欢她，她能在我还在她身边的时候多看我几眼吗？\n\r" +
        "嘉然小姐说接下来的每个圣诞夜都要和大家一起过[注2]。我不知道大家指哪些人。好希望这个集合能够对我做一次胞吞。\n\r" +
        "\n\r" +
        "猫猫还在害怕嘉然小姐。\n\r" +
        "我会去把她爱的猫猫引来的。\n\r" +
        "我知道稍有不慎，我就会葬身猫口。\n\r" +
        "那时候嘉然小姐大概会把我的身体好好地装起来扔到门外吧。\n\r" +
        "###### 那我就成了一包鼠条，嘻嘻[注3]。\n\r" +
        "我希望她能把我扔得近一点，因为我还是好喜欢她。会一直喜欢下去的。\n\r" +
        "\n\r" +
        "我的灵魂透过窗户向里面看去，挂着的铃铛在轻轻鸣响，嘉然小姐慵懒地靠在沙发上，表演得非常温顺的橘猫坐在她的肩膀。壁炉的火光照在她的脸庞，我冻僵的心脏在风里微微发烫。",
      creator: { connect: { id: alice } },
      tags: { connect: [{ id: commentTag1 }, { id: commentTag2 }] },
    },
  });

  const { id: comment2 } = await prisma.comment.create({
    data: {
      title: "一条来自乃淇淋的评论",
      content: "## 嘉然，我真的好喜欢你啊，mua~，为了你，我要听猫中毒",
      creator: { connect: { id: alice } },
      tags: { connect: [{ id: commentTag2 }] },
    },
  });

  const { id: reply0 } = await prisma.reply.create({
    data: {
      content:
        "我好想做嘉然小姐的狗啊。\n\r" +
        "可是嘉然小姐说她喜欢的是猫，我哭了。\n\r" +
        "我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。",
      creator: { connect: { id: alice } },
      comment: { connect: { id: comment1 } },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。\n\r" +
        "但我还是问了嘉然小姐:“我能不能做你的狗？”\n\r" +
        "我知道我是注定做不了狗的。但如果她喜欢狗，我就可以一直在身边看着她了，哪怕她怀里抱着的永远都是狗。",
      creator: { connect: { id: alice } },
      comment: { connect: { id: comment1 } },
    },
  });

  const { id: replyMark1 } = await prisma.reply.create({
    data: {
      content:
        "可是她说喜欢的是猫。\n\r" +
        "她现在还在看着我，还在逗我开心，是因为猫还没有出现，只有我这老鼠每天蹑手蹑脚地从洞里爬出来，远远地和她对视。\n\r" +
        "等她喜欢的猫来了的时候，我就该重新滚回我的洞了吧。\n\r" +
        "但我还是好喜欢她，她能在我还在她身边的时候多看我几眼吗？\n\r" +
        "嘉然小姐说接下来的每个圣诞夜都要和大家一起过[注 1]。我不知道大家指哪些人。好希望这个集合能够对我做一次胞吞。",
      creator: { connect: { id: bob } },
      comment: { connect: { id: comment1 } },
    },
  });

  await prisma.reply.create({
    data: {
      content:
        "猫猫还在害怕嘉然小姐。\n\r" +
        "我会去把她爱的猫猫引来的。\n\r" +
        "我知道稍有不慎，我就会葬身猫口。",
      creator: { connect: { id: cherry } },
      comment: { connect: { id: comment1 } },
    },
  });

  const { id: replyMark2 } = await prisma.reply.create({
    data: {
      content:
        "那时候嘉然小姐大概会把我的身体好好地装起来扔到门外吧。\n\r" +
        "那我就成了一包鼠条，嘻嘻[注 2]。\n\r" +
        "我希望她能把我扔得近一点，因为我还是好喜欢她。会一直喜欢下去的。",
      creator: { connect: { id: david } },
      comment: { connect: { id: comment1 } },
    },
  });

  const { id: replyMark3 } = await prisma.reply.create({
    data: {
      content: "我知道嘉然小姐会把我的身体好好地装起来扔到门外吧。\n\r",
      creator: { connect: { id: alice } },
      comment: { connect: { id: comment1 } },
      domReply: { connect: { id: replyMark2 } },
    },
  });

  const { id: replyMark4 } = await prisma.reply.create({
    data: {
      content:
        "我希望她能把我扔得近一点，因为我还是好喜欢她。会一直喜欢下去的。",
      creator: { connect: { id: bob } },
      comment: { connect: { id: comment1 } },
      domReply: { connect: { id: replyMark2 } },
      replyTo: { connect: { id: replyMark3 } },
    },
  });

  await prisma.reply.create({
    data: {
      content: "我知道嘉然小姐会把我的身体好好地装起来扔到门外吧。\n\r",
      creator: { connect: { id: cherry } },
      comment: { connect: { id: comment1 } },
      domReply: { connect: { id: replyMark2 } },
      replyTo: { connect: { id: replyMark4 } },
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
        content: "注 1 : 指嘉然发表的上一篇，即12月23日的动态",
        creatorId: alice,
        commentId: comment1,
        domId: reply0,
      },
      {
        content: "注 2: 此处neta了某位已毕业的vup转生后的账号名称",
        creatorId: alice,
        commentId: comment1,
        domId: replyMark1,
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
        creatorId: cherry,
        commentId: comment1,
      },
      {
        content: "So möchte ich ein Hund von Frau Diana werden.",
        creatorId: david,
        commentId: comment1,
      },
      {
        content:
          "# 我好想做嘉然小姐的狗啊。\n\r" +
          "可是嘉然小姐说她喜欢的是猫，我哭了。\n\r" +
          "我知道既不是狗也不是猫的我为什么要哭的。因为我其实是一只老鼠。\n\r" +
          "## 我从没奢望嘉然小姐能喜欢自己。我明白的，所有人都喜欢理解余裕上手天才打钱的萌萌的狗狗或者猫猫，没有人会喜欢阴湿带病的老鼠。\n\r" +
          "但我还是问了嘉然小姐:“我能不能做你的狗？”\n\r" +
          "我知道我是注定做不了狗的。但如果她喜欢狗，我就可以一直在身边看着她了，哪怕她怀里抱着的永远都是狗。\n\r" +
          "## 可是她说喜欢的是猫。\n\r" +
          "她现在还在看着我，还在逗我开心，是因为猫还没有出现，只有我这老鼠每天蹑手蹑脚地从洞里爬出来，远远地和她对视。\n\r" +
          "等她喜欢的猫来了的时候，我就该重新滚回我的洞了吧。\n\r" +
          "但我还是好喜欢她，她能在我还在她身边的时候多看我几眼吗？\n\r" +
          "嘉然小姐说接下来的每个圣诞夜都要和大家一起过[注2]。我不知道大家指哪些人。好希望这个集合能够对我做一次胞吞。\n\r" +
          "\n\r" +
          "猫猫还在害怕嘉然小姐。\n\r" +
          "我会去把她爱的猫猫引来的。\n\r" +
          "我知道稍有不慎，我就会葬身猫口。\n\r" +
          "那时候嘉然小姐大概会把我的身体好好地装起来扔到门外吧。\n\r" +
          "###### 那我就成了一包鼠条，嘻嘻[注3]。\n\r" +
          "我希望她能把我扔得近一点，因为我还是好喜欢她。会一直喜欢下去的。\n\r" +
          "\n\r" +
          "我的灵魂透过窗户向里面看去，挂着的铃铛在轻轻鸣响，嘉然小姐慵懒地靠在沙发上，表演得非常温顺的橘猫坐在她的肩膀。壁炉的火光照在她的脸庞，我冻僵的心脏在风里微微发烫。",
        creatorId: alice,
        commentId: comment2,
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

  const { id: room1 } = await prisma.chatRoom.create({
    data: {
      name: "TestChatRoom",
      description: "Test ChatRoom",
      private: true,
      password: "123456",
    },
  });

  await prisma.chatRoom.create({
    data: {
      name: "Public Room",
      description: "Another Test ChatRoom",
      private: false,
    },
  });

  await prisma.chatRoomUser.create({
    data: {
      roomId: room1,
      userId: alice,
      role: "Owner",
    },
  });

  await prisma.chatMessage.create({
    data: {
      content: "Hello World",
      roomId: room1,
      senderId: alice,
    },
  });
}

seed();

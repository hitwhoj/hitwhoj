import { Message, Space, Tag, Typography } from "@arco-design/web-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { Navigator } from "~/src/Navigator";
import { findContestPrivacy, findContestTeam } from "~/utils/db/contest";
import { ContestStateTag } from "~/src/contest/ContestStateTag";
import { ContestSystemTag } from "~/src/contest/ContestSystemTag";
import {
  IconEyeInvisible,
  IconTag,
  IconTrophy,
} from "@arco-design/web-react/icon";
import { TagSpace } from "~/src/TagSpace";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { useContext, useEffect } from "react";
import { fromEventSource } from "~/utils/eventSource";
import type { MessageType } from "./$contestId/clarificationEvents";
import { filter } from "rxjs";
import { UserContext } from "~/utils/context/user";

export async function loader({ request, params }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  const perm = self.team(await findContestTeam(contestId)).contest(contestId);
  await perm.checkPermission(
    (await findContestPrivacy(contestId))
      ? Permissions.PERM_VIEW_CONTEST
      : Permissions.PERM_VIEW_CONTEST_PUBLIC
  );
  const [hasEditPerm] = await perm.hasPermission(Permissions.PERM_EDIT_CONTEST);
  const [canReply] = await perm.hasPermission(
    Permissions.PERM_REPLY_CONTEST_CLARIFICATION
  );

  const contest = await db.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
      system: true,
      beginTime: true,
      endTime: true,
      private: true,
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!contest) {
    throw new Response("Contest not found", { status: 404 });
  }

  return { contest, hasEditPerm, canReply };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `比赛: ${data?.contest.title} - HITwh OJ`,
});

export default function ContestView() {
  const { contest, hasEditPerm, canReply } = useLoaderData<typeof loader>();
  const { contestId } = useParams();
  const self = useContext(UserContext);

  useEffect(() => {
    const observable = fromEventSource<MessageType>(
      `/contest/${contestId}/clarificationEvents`
    );
    const subscription = canReply
      ? observable
          .pipe(filter((message) => message.type === "judge"))
          .subscribe((message) => {
            Message.info({
              content: `用户对题目${String.fromCharCode(
                0x40 + message.rank
              )}的反馈${message.content}需要您的回复`,
              duration: 0,
              closable: true,
            });
          })
      : observable
          .pipe(
            filter(
              (message) => message.type === "user" && message.userId === self
            )
          )
          .subscribe((message) => {
            Message.info({
              content: message.resolved
                ? `您对题目${String.fromCharCode(0x40 + message.rank)}的反馈${
                    message.content
                  }已被解决`
                : `您对题目${String.fromCharCode(0x40 + message.rank)}的反馈${
                    message.content
                  }已被回复`,
              duration: 0,
              closable: true,
            });
          });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Typography className="contest-problem-container">
      <Typography.Title heading={3} className="contest-problem-hide">
        <Space>
          <IconTrophy />
          {contest.title}
        </Space>
      </Typography.Title>

      <Typography.Paragraph className="contest-problem-hide">
        <TagSpace>
          <ContestStateTag
            beginTime={contest.beginTime}
            endTime={contest.endTime}
          />
          <ContestSystemTag system={contest.system} />
          {contest.private && (
            <Tag icon={<IconEyeInvisible />} color="gold">
              隐藏
            </Tag>
          )}
          {contest.tags.map(({ name }) => (
            <Link to={`/contest/tag/${name}`} key={name}>
              <Tag icon={<IconTag />}>{name}</Tag>
            </Link>
          ))}
        </TagSpace>
      </Typography.Paragraph>

      <Typography.Paragraph className="contest-problem-hide">
        <Navigator
          routes={[
            { title: "详情", key: "." },
            { title: "题目", key: "problem" },
            { title: canReply ? "用户反馈" : "我的反馈", key: "clarification" },
            ...(hasEditPerm ? [{ title: "编辑", key: "edit" }] : []),
          ]}
        />
      </Typography.Paragraph>
      <Outlet />
    </Typography>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

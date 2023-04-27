import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { ContestLink } from "~/src/contest/ContestLink";
import { selectContestListData } from "~/utils/db/contest";
import { formatNumber } from "~/utils/tools";
import ActivityCalendar from "react-activity-calendar";
import type { Level } from "react-activity-calendar";
import ReactTooltip from "react-tooltip";
import { defaultThemeColor } from "~/utils/theme";
import { useSignalLoaderData } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { useTheme } from "~/utils/context";

export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_VIEW_USER_PROFILE_SELF
      : Permissions.PERM_VIEW_USER_PROFILE
  );
  const now = new Date();
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      participatedContests: {
        select: {
          contest: {
            select: {
              ...selectContestListData,
            },
          },
        },
      },
      _count: {
        select: {
          createdRecords: true,
          createdComments: true,
          createdReplies: true,
        },
      },
      createdRecords: {
        select: {
          submittedAt: true,
        },
        where: {
          submittedAt: {
            lte: now,
            gt: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
}

// generate 5 color from hex fromColor to toColor with 5 steps
function getLevelColors(fromColor: string, toColor: string) {
  const fromRGB = hexToRGB(fromColor);
  const toRGB = hexToRGB(toColor);
  const levelColors: string[] = [];
  for (let i = 0; i < 5; i++) {
    const color = `rgb(${fromRGB[0] + (toRGB[0] - fromRGB[0]) * (i / 4)}, ${
      fromRGB[1] + (toRGB[1] - fromRGB[1]) * (i / 4)
    }, ${fromRGB[2] + (toRGB[2] - fromRGB[2]) * (i / 4)})`;
    levelColors.push(color);
  }
  return levelColors;
}

// Hex color to RGB color
function hexToRGB(color: string) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return [r, g, b];
}

export default function UserStatistics() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const user = useComputed(() => loaderData.value.user);

  const theme = useTheme();

  const activityCalendarTheme = useComputed(() => {
    const fromColor = defaultThemeColor[theme.value].base200;
    const toColor = defaultThemeColor[theme.value].primary;
    const [level0, level1, level2, level3, level4] = getLevelColors(
      fromColor,
      toColor
    );
    return { level0, level1, level2, level3, level4 };
  });

  // FIXME 摆烂了，这个页面就跟 profile 页面合并了吧
  // 丢给 @lingyunchi 处理吧

  const activityCalendarData = useComputed(() => {
    const now = new Date();

    return Object.entries(
      user.value.createdRecords.reduce(
        (cur, record) => {
          const date = new Date(record.submittedAt).toISOString().slice(0, 10);
          if (cur[date]) cur[date]++;
          else cur[date] = 1;
          return cur;
        },
        {
          [now.toISOString().slice(0, 10)]: 0,
          [new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10)]: 0,
        } as Record<string, number>
      )
    )
      .map(([date, count]) => {
        // level 0: 0, level 1: 1-2, level 2: 3-4, level 3: 4-5, level 4: 5-infinity
        const level = Math.min(Math.floor(count + 1 / 2), 4) as Level;
        return { date, count, level };
      })
      .sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });
  });

  return (
    <>
      <div className="stats w-full">
        <div className="stat place-items-center">
          <ActivityCalendar
            data={activityCalendarData.value}
            labels={{
              tooltip:
                "<span style='font-weight: bold;' color='white'>{{count}} submitions</span> on {{date}}",
              totalCount: "{{count}} submitions in {{year}}",
            }}
            theme={activityCalendarTheme.value}
          >
            <ReactTooltip html />
          </ActivityCalendar>
        </div>
      </div>
      <div className="stats w-full">
        <div className="stat place-items-center">
          <div className="stat-value">
            {formatNumber(user.value._count.createdRecords)}
          </div>
          <div className="stat-desc">提交</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-value">
            {formatNumber(user.value._count.createdComments)}
          </div>
          <div className="stat-desc">评论</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-value">
            {formatNumber(user.value._count.createdReplies)}
          </div>
          <div className="stat-desc">回复</div>
        </div>
      </div>

      <h2>参与的比赛</h2>
      <ul>
        {user.value.participatedContests.map(({ contest }) => (
          <li key={contest.id}>
            <ContestLink contest={contest} />
          </li>
        ))}
      </ul>
    </>
  );
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

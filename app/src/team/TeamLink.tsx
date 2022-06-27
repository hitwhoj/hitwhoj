import { Space } from "@arco-design/web-react";
import { IconUserGroup } from "@arco-design/web-react/icon";
import type { Team } from "@prisma/client";
import { Link } from "@remix-run/react";

type Props = {
  team: Pick<Team, "id" | "name">;
};

export function TeamLink({ team }: Props) {
  return (
    <Link to={`/team/${team.id}`}>
      <Space>
        <IconUserGroup />
        {team.name}
      </Space>
    </Link>
  );
}

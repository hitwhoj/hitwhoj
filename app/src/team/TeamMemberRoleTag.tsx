import { Tag } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import type { TeamMemberRole } from "@prisma/client";

type Props = {
  role: TeamMemberRole;
};

const roleColor: Record<TeamMemberRole, string> = {
  Owner: "purple",
  Admin: "green",
  Member: "gray",
};

const roleName: Record<TeamMemberRole, string> = {
  Owner: "拥有者",
  Admin: "管理员",
  Member: "成员",
};

export function TeamMemberRoleTag({ role }: Props) {
  return (
    <Tag color={roleColor[role]} icon={<IconUser />}>
      {roleName[role]}
    </Tag>
  );
}

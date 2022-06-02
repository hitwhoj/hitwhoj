import { Space, Tag } from "@arco-design/web-react";
import { IconTag } from "@arco-design/web-react/icon";
import { Link } from "@remix-run/react";
import type { ProblemListData } from "~/utils/db/problem";
import { ProblemMemoryLimitTag } from "./ProblemMemoryLimitTag";
import { ProblemTimeLimitTag } from "./ProblemTimeLimitTag";

type Props = {
  problem: ProblemListData;
};

export function ProblemTags({ problem }: Props) {
  return (
    <Space>
      <ProblemTimeLimitTag time={1} />
      <ProblemMemoryLimitTag memory={256} />
      {problem.tags.map(({ name }) => (
        <Tag key={name} icon={<IconTag />}>
          <Link to={`/problem/tag/${name}`}>{name}</Link>
        </Tag>
      ))}
    </Space>
  );
}

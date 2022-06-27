import { Space } from "@arco-design/web-react";
import { IconEyeInvisible } from "@arco-design/web-react/icon";
import type { Problem } from "@prisma/client";
import { Link } from "@remix-run/react";

type Props = {
  problem: Pick<Problem, "id" | "title" | "private">;
};

export function ProblemLink({ problem }: Props) {
  return (
    <Link to={`/problem/${problem.id}`}>
      <Space>
        {problem.title}
        {problem.private && <IconEyeInvisible />}
      </Space>
    </Link>
  );
}

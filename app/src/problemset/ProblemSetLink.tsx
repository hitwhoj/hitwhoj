import { Space } from "@arco-design/web-react";
import { IconEyeInvisible } from "@arco-design/web-react/icon";
import type { ProblemSet } from "@prisma/client";
import { Link } from "@remix-run/react";

type Props = {
  problemset: Pick<ProblemSet, "id" | "title" | "private">;
};

export function ProblemSetLink({ problemset }: Props) {
  return (
    <Link to={`/problemset/${problemset.id}`}>
      <Space>
        {problemset.title}
        {problemset.private && <IconEyeInvisible />}
      </Space>
    </Link>
  );
}

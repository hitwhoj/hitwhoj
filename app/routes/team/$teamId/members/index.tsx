import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { User } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = {
  members: Pick<User, "id" | "username">[];
};

export const loader: LoaderFunction<LoaderData> = async ({ params }) => {
  const teamId = invariant(idScheme.safeParse(params.teamId));
  const result = await db.teamMember.findMany({
    where: { teamId },
    select: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return {
    members: result.map(({ user }) => user),
  };
};

export default function MemberList() {
  const { members } = useLoaderData<LoaderData>();
  return (
    <>
      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="edit">编辑成员</Link>
        </li>
      </ul>

      <h3> memberList </h3>
      {members.length ? (
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              <Link to={`/user/${member.id}`}>{member.username}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>...?</div>
      )}
    </>
  );
}

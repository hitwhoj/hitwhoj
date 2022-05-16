import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import type { User } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import { idScheme } from "~/utils/scheme";

type LoaderData = Pick<User, "id" | "username">[];

export const loader: LoaderFunction = async ({ params }) => {
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

  return json(result.map(({ user }) => user));
};

export default function MemberList() {
  const data = useLoaderData<LoaderData>();
  return (
    <>
      <h3>Operation</h3>
      <ul>
        <li>
          <Link to="edit">编辑成员</Link>
        </li>
      </ul>

      <h3> memberList </h3>
      {data.length ? (
        <ul>
          {data.map((member) => (
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

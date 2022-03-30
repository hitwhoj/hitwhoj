import { Link, json, useLoaderData, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { User } from "@prisma/client";
import { invariant } from "~/utils/invariant";
import {idScheme} from "~/utils/scheme"

type LoaderData = Pick<User, "uid" | "username">[];

export const loader: LoaderFunction = async ({ params }) => {
  const tid = invariant(idScheme.safeParse(params.teamId))   ;
  const result = await db.teamMember.findMany({
    where: {
      teamId: Number(tid),
    },
    include: {
      member: {
        select: {
          uid: true,
          username: true,
        },
      },
    },
  });
  var data: LoaderData = [];
  for (let i = 0; i < result.length; i++) {
    data.push(result[i].member);
  }

  return json(data);
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
            <li key={member.uid}>
              <Link to={`/user/${member.uid}`}>{member.username}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>...?</div>
      )}
    </>
  );
}

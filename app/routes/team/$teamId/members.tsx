import { Link, json, useLoaderData, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { User, TeamMember } from "@prisma/client";

type LoaderData = {
  uid: number;
  nickname: string;
}[];

export const loader: LoaderFunction = async ({ params }) => {
  const tid = params.teamId;
  const result = await db.teamMember.findMany({
    where: {
      teamId: tid,
    },
    include: {
      member: {
        select: {
          uid: true,
          nickname: true,
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
        <li>添加成员</li>
        <li>删除成员</li>
      </ul>

      <h3> memberList </h3>
      {data.length ? (
        <ul>
          {data.map((member) => (
            <li key={member.uid}>
              <Link to={`${member.uid}`}>{member.nickname}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>...?</div>
      )}
    </>
  );
}

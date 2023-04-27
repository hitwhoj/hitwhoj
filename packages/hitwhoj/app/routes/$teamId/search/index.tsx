import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { db } from "~/utils/server/db.server";
import { useState } from "react";
import { UserLink } from "~/src/user/UserLink";
import { SystemUserRole } from "@prisma/client";
import { searchUserData } from "~/utils/db/user";
import { findRequestUser } from "~/utils/permission";
import { invariant } from "~/utils/invariant";
import { idScheme, privilegeScheme } from "~/utils/scheme";
import { Privileges } from "~/utils/permission/privilege";

//从输入库查询所有user 同时定义了selectUserPrivilege缩小查询范围
export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  if (self.userId !== null) {
    const temp = await db.user.findUnique({
      where: {
        id: self.userId,
      },
      select: searchUserData,
    });
    const users = await db.user.findMany({
      select: searchUserData,
    });
    return json({ users, temp });
  } else {
    throw new Response("User not found", { status: 404 });
  }
}

export async function action({ request }: ActionArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  const form = await request.formData();
  const userId = invariant(idScheme, form.get("userId"), { status: 404 });
  await db.$transaction(async (db) => {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, privilege: true },
    });
    if (!user) {
      throw new Response("User not found", { status: 404 });
    }
    const privilege = invariant(privilegeScheme, form.get("privilege"));
    await db.user.update({
      where: { id: user.id },
      data: { privilege },
    });
  });
  return null;
}
//定义tr下面的权限
function PrivilegeComponent(props: { hasPrivilege }) {
  const hasPrivilege = props.hasPrivilege;
  return (
    <tr>
      <th>成员</th>
      <th>角色</th>
      {hasPrivilege && (
        <>
          <th>操作权限</th>
          <th>登录权限</th>
        </>
      )}
    </tr>
  );
}

function CheckBoxComponent(props: { user; privilege }) {
  const user = props.user;
  const privilege = props.privilege;
  const [checked, changeChecked] = useState(
    (user.privilege & privilege) === privilege
  );
  const { state } = useTransition();
  const fetcher = useFetcher();
  const isUpdating = state !== "idle";
  let changeHandler = (event: any) => {
    let formData = new FormData();
    formData.append("userId", user.id);
    formData.append("privilege", privilege ^ user.privilege);
    fetcher.submit(formData, { method: "post" });
    changeChecked(event.target.checked);
  };
  return (
    <>
      <td>
        <Form method="post">
          <input
            type="checkbox"
            checked={checked}
            className="checkbox checkbox-primary"
            disabled={isUpdating}
            onChange={(event) => changeHandler(event)}
          />
        </Form>
      </td>
    </>
  );
}
//子组件
function SearchComponent(props: { users; temp }) {
  const usersLef = props.users;
  const temp = props.temp;
  const hasPrivilege =
    temp.role === SystemUserRole.Admin || temp.role === SystemUserRole.Root;
  return (
    <div>
      <table className="not-prose table-compact table w-full">
        <thead>
          <PrivilegeComponent hasPrivilege={hasPrivilege} />
        </thead>
        <tbody>
          {usersLef.map((user) => {
            return (
              <tr key={user.username}>
                <td>
                  <UserLink user={user} />
                </td>
                <td>
                  {user.role === SystemUserRole.Admin ? (
                    <span className="badge badge-primary">管理员</span>
                  ) : user.role === SystemUserRole.Root ? (
                    <span className="badge badge-secondary">超级用户</span>
                  ) : (
                    <span className="badge">用户</span>
                  )}
                </td>
                {hasPrivilege && (
                  <>
                    <CheckBoxComponent
                      user={user}
                      privilege={Privileges.PRIV_OPERATE}
                    />
                    <CheckBoxComponent
                      user={user}
                      privilege={Privileges.PRIV_LOGIN}
                    />
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default function Search() {
  //获得所有用户数据
  const { users, temp } = useLoaderData<typeof loader>();
  const [usersLef, setUserLef] = useState(users);
  //获得输入框的数据
  const [userName, setUserName] = useState("");
  // @ts-ignore
  let changeHandler = (event) => {
    const v = event.target.value;
    setUserName(v);
    if (v === "") {
      setUserLef(users);
    } else {
      setUserLef(
        users.filter((item) => {
          return (
            item.username.toLocaleLowerCase().search(v.toLocaleLowerCase()) !==
            -1
          );
        })
      );
    }
  };
  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">请输入用户名称:</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={userName}
          onChange={changeHandler}
        />
      </div>
      <SearchComponent users={usersLef} temp={temp} />
    </div>
  );
}

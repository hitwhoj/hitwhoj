import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { z } from "zod";
import { db } from "~/utils/server/db.server";
import { invariant } from "~/utils/invariant";
import {
  bioScheme,
  emailScheme,
  emptyStringScheme,
  idScheme,
  nicknameScheme,
  usernameScheme,
} from "~/utils/scheme";
import { Permissions } from "~/utils/permission/permission";
import { findRequestUser } from "~/utils/permission";
import { Privileges } from "~/utils/permission/privilege";
import { useContext, useEffect } from "react";
import { ToastContext } from "~/utils/context/toast";

export async function loader({ request, params }: LoaderArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_EDIT_USER_PROFILE_SELF
      : Permissions.PERM_EDIT_USER_PROFILE
  );

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      username: true,
      nickname: true,
      avatar: true,
      email: true,
      bio: true,
      department: true,
      studentId: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `编辑用户: ${data?.user.nickname || data?.user.username} - HITwh OJ`,
});

export async function action({ request, params }: ActionArgs) {
  const userId = invariant(idScheme, params.userId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(
    self.userId === userId
      ? Permissions.PERM_EDIT_USER_PROFILE_SELF
      : Permissions.PERM_EDIT_USER_PROFILE
  );

  const form = await request.formData();

  const username = invariant(usernameScheme, form.get("username"));
  const nickname = invariant(
    nicknameScheme.or(emptyStringScheme),
    form.get("nickname")
  );
  // TODO: avatar should not be like this
  const avatar = invariant(
    z.string().url("Avatar must be a valid URL").or(emptyStringScheme),
    form.get("avatar")
  );
  const email = invariant(emailScheme.or(emptyStringScheme), form.get("email"));
  const bio = invariant(bioScheme.or(emptyStringScheme), form.get("bio"));
  const department = invariant(z.string(), form.get("department"));
  const studentId = invariant(z.string(), form.get("studentId"));

  await db.$transaction(async (db) => {
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (user && user.id !== userId) {
      throw new Response("Username already taken", { status: 400 });
    }

    await db.user.update({
      where: { id: userId },
      data: {
        username,
        nickname,
        avatar,
        email,
        bio,
        department,
        studentId,
      },
    });
  });

  return null;
}

export default function UserEdit() {
  const { user } = useLoaderData<typeof loader>();
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isUpdating = isActionSubmit || isActionReload;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("更新成功");
    }
  }, [isActionReload]);

  return (
    <Form method="post" className="form-control mx-auto w-full max-w-lg gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">用户名 (字母数字下划线)</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="username"
          defaultValue={user.username}
          disabled={isUpdating}
          required
          pattern="\w+"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">用户昵称</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="nickname"
          defaultValue={user.nickname}
          disabled={isUpdating}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">个性签名</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="bio"
          defaultValue={user.bio}
          disabled={isUpdating}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">电子邮箱</span>
        </label>
        <input
          className="input input-bordered"
          type="email"
          name="email"
          defaultValue={user.email}
          disabled={isUpdating}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">头像地址 (比较诡异，估计要改)</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="avatar"
          defaultValue={user.avatar}
          placeholder="https://"
          disabled={isUpdating}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">工作单位</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="department"
          defaultValue={user.department}
          disabled={isUpdating}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">学号</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="studentId"
          defaultValue={user.studentId}
          disabled={isUpdating}
        />
      </div>

      <div className="form-control">
        <button className="btn btn-primary" type="submit" disabled={isUpdating}>
          确认修改
        </button>
      </div>
    </Form>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

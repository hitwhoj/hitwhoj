import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
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
import { useSignalLoaderData, useSignalTransition } from "~/utils/hooks";
import { useComputed } from "@preact/signals-react";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";

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
  const loaderData = useSignalLoaderData<typeof loader>();
  const user = useComputed(() => loaderData.value.user);

  const transition = useSignalTransition();

  const Toasts = useToasts();

  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("更新成功");
    }
  }, [transition.actionSuccess]);

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
          defaultValue={user.value.username}
          disabled={transition.isRunning}
          required
          pattern="\w+"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">用户昵称（请使用真实姓名）</span>
        </label>
        <input
          className="input input-bordered"
          type="text"
          name="nickname"
          defaultValue={user.value.nickname}
          disabled={transition.isRunning}
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
          defaultValue={user.value.bio}
          disabled={transition.isRunning}
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
          defaultValue={user.value.email}
          disabled={transition.isRunning}
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
          defaultValue={user.value.avatar}
          placeholder="https://"
          disabled={transition.isRunning}
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
          defaultValue={user.value.department}
          disabled={transition.isRunning}
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
          defaultValue={user.value.studentId}
          disabled={transition.isRunning}
        />
      </div>

      <div className="form-control">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={transition.isRunning}
        >
          确认修改
        </button>
      </div>
    </Form>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

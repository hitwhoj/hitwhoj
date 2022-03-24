import { User } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
} from "remix";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import {
  emailScheme,
  idScheme,
  nicknameScheme,
  usernameScheme,
} from "~/utils/scheme";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  user: Pick<User, "username" | "nickname" | "email" | "avatar">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
      username: true,
      nickname: true,
      avatar: true,
      email: true,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return json({ user });
};

enum ActionType {
  UpdateUsername = "updateUsername",
  UpdateNickname = "updateNickname",
  UpdateAvatar = "updateAvatar",
  UpdateEmail = "updateEmail",
}

export const action: ActionFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect(`/login?redirect=${new URL(request.url).pathname}`);
  }

  const uid = invariant(idScheme.safeParse(params.uid), { status: 404 });

  // FIXME: 检查权限
  if (self !== uid) {
    throw new Response("Permission denied", { status: 403 });
  }

  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UpdateUsername: {
      const username = invariant(
        usernameScheme.safeParse(form.get("username"))
      );

      const user = await db.user.findUnique({
        where: { username },
        select: { uid: true },
      });

      if (user && user.uid !== uid) {
        throw new Response("Username already taken", { status: 400 });
      }

      await db.user.update({
        where: { uid },
        data: { username },
      });

      return null;
    }

    case ActionType.UpdateNickname: {
      const nickname = invariant(
        nicknameScheme.safeParse(form.get("nickname"))
      );

      await db.user.update({
        where: { uid },
        data: { nickname },
      });

      return null;
    }

    case ActionType.UpdateAvatar: {
      const avatar = invariant(
        z
          .string()
          .url("Avatar must be a valid URL")
          .safeParse(form.get("avatar"))
      );

      await db.user.update({
        where: { uid },
        data: { avatar },
      });

      return null;
    }

    case ActionType.UpdateEmail: {
      const email = invariant(emailScheme.safeParse(form.get("email")));

      await db.user.update({
        where: { uid },
        data: { email },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

function UsernameEditor({ username }: { username: string }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input
        type="text"
        name="username"
        defaultValue={username}
        disabled={isUpdating}
        required
      />

      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateUsername}
      >
        更新捏
      </button>
    </fetcher.Form>
  );
}

function NicknameEditor({ nickname }: { nickname: string }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input
        type="text"
        name="nickname"
        defaultValue={nickname}
        disabled={isUpdating}
        required
      />

      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateNickname}
      >
        更新捏
      </button>
    </fetcher.Form>
  );
}

function EmailEditor({ email }: { email: string }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input
        type="email"
        name="email"
        defaultValue={email}
        disabled={isUpdating}
        required
      />

      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateEmail}
      >
        更新捏
      </button>
    </fetcher.Form>
  );
}

function AvatarEditor({ avatar }: { avatar: string }) {
  const fetcher = useFetcher();
  const isUpdating = fetcher.state !== "idle";

  return (
    <fetcher.Form method="post">
      <input
        type="text"
        name="avatar"
        defaultValue={avatar}
        disabled={isUpdating}
        placeholder="https://..."
        required
      />

      <button
        type="submit"
        disabled={isUpdating}
        name="_action"
        value={ActionType.UpdateAvatar}
      >
        更新捏
      </button>
    </fetcher.Form>
  );
}

export default function UserEdit() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <>
      <h3>Edit</h3>
      <UsernameEditor username={user.username} />
      <NicknameEditor nickname={user.nickname} />
      <EmailEditor email={user.email} />
      <AvatarEditor avatar={user.avatar} />
    </>
  );
}

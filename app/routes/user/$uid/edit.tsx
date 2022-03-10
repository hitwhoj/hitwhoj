import { User } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
} from "remix";
import { db } from "~/utils/db.server";
import {
  ensureEmail,
  ensureNotEmptyString,
  ensureNumericId,
  ensureString,
  invariant,
} from "~/utils/invariant";
import { findSessionUid } from "~/utils/sessions";

type LoaderData = {
  user: Pick<User, "nickname" | "email" | "avatar">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect("/login");
  }

  const uid = invariant(ensureNumericId(params.uid), "Invalid uid", {
    status: 404,
  });

  const user = await db.user.findUnique({
    where: { uid },
    select: {
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
  UpdateNickname = "updateNickname",
  UpdateAvatar = "updateAvatar",
  UpdateEmail = "updateEmail",
}

export const action: ActionFunction = async ({ request, params }) => {
  const self = await findSessionUid(request);

  if (!self) {
    return redirect("/login");
  }

  const uid = invariant(ensureNumericId(params.uid), "Invalid uid", {
    status: 404,
  });

  // TODO: 检查权限
  if (self !== uid) {
    throw new Response("Permission denied", { status: 403 });
  }

  const form = await request.formData();

  const _action = form.get("_action");

  switch (_action) {
    case ActionType.UpdateNickname: {
      const nickname = invariant(
        ensureNotEmptyString(form.get("nickname")),
        "Nickname is required"
      );

      const nicknamedUser = await db.user.findUnique({
        where: { nickname },
        select: { uid: true },
      });

      if (nicknamedUser) {
        throw new Response("Nickname already exists", { status: 400 });
      }

      await db.user.update({
        where: { uid },
        data: { nickname },
      });

      return null;
    }

    case ActionType.UpdateAvatar: {
      const avatar = invariant(
        ensureString(form.get("avatar")),
        "Avatar is required"
      );

      await db.user.update({
        where: { uid },
        data: { avatar },
      });

      return null;
    }

    case ActionType.UpdateEmail: {
      const email = invariant(
        ensureEmail(form.get("email")),
        "Email is required"
      );

      await db.user.update({
        where: { uid },
        data: { email },
      });

      return null;
    }
  }

  throw new Response("I'm a teapot", { status: 418 });
};

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
      <NicknameEditor nickname={user.nickname} />
      <EmailEditor email={user.email || ""} />
      <AvatarEditor avatar={user.avatar || ""} />
    </>
  );
}

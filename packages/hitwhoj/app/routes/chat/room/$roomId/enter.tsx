import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useSignalTransition } from "~/utils/hooks";
import { invariant } from "~/utils/invariant";
import { findRequestUser } from "~/utils/permission";
import { Permissions } from "~/utils/permission/permission";
import { Privileges } from "~/utils/permission/privilege";
import { idScheme, weakPasswordScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";

export async function loader({ request, params }: LoaderArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  if (!self.userId) throw new Response("Unauthorized", { status: 401 });
  await self
    .room(roomId)
    .checkPermission(Permissions.PERM_JOIN_CHATROOM_MESSAGE);

  const room = await db.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      description: true,
      private: true,
    },
  });

  if (!room) {
    throw new Response("Room not found", { status: 404 });
  }

  return json({ room });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `加入聊天室: ${data?.room.name} - HITwh OJ`,
  description: data?.room.description,
});

export default function EnterRoom() {
  const { room } = useLoaderData<typeof loader>();
  const { loading } = useSignalTransition();

  return (
    <>
      <h1 className="flex gap-4">
        {room.private && <HiOutlineLockClosed className="shrink-0" />}
        <span>{room.name}</span>
      </h1>

      <p>{room.description}</p>

      <Form method="post" className="flex gap-4">
        {room.private && (
          <input
            className="input input-bordered"
            type="password"
            name="password"
            placeholder="请输入房间密码"
            disabled={loading.value}
          />
        )}
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading.value}
        >
          加入房间
        </button>
      </Form>
    </>
  );
}

export async function action({ request, params }: ActionArgs) {
  const roomId = invariant(idScheme, params.roomId, { status: 404 });
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self
    .room(roomId)
    .checkPermission(Permissions.PERM_JOIN_CHATROOM_MESSAGE);

  await db.$transaction(async (db) => {
    const room = await db.chatRoom.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        private: true,
        password: true,
      },
    });

    if (!room) {
      throw new Response("讨论组不存在", { status: 404 });
    }

    if (room.private) {
      const form = await request.formData();
      const password = invariant(weakPasswordScheme, form.get("password"));

      if (password !== room.password) {
        throw new Response("密码错误", { status: 400 });
      }
    }

    await db.chatRoomUser.create({
      data: {
        userId: self.userId!,
        roomId: room.id,
      },
    });
  });

  // 加入成功，跳转到聊天室
  return redirect(`/chat/room/${roomId}`);
}

export { CatchBoundary } from "~/src/CatchBoundary";
export { ErrorBoundary } from "~/src/ErrorBoundary";

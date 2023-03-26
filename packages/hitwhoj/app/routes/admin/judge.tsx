import { useComputed } from "@preact/signals-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSignalLoaderData } from "~/utils/hooks";
import { findRequestUser } from "~/utils/permission";
import { UserPermission } from "~/utils/permission/permission/user";
import { Privileges } from "~/utils/permission/privilege";
import { db } from "~/utils/server/db.server";
import { judge } from "~/utils/server/judge/manager.server";

export async function loader({ request }: LoaderArgs) {
  const self = await findRequestUser(request);
  await self.checkPrivilege(Privileges.PRIV_OPERATE);
  await self.checkPermission(UserPermission.Roots);

  // list all judges
  const judges = await db.judge.findMany({
    select: {
      id: true,
      ip: true,
      port: true,
      name: true,
    },
  });
  const states = judge.getState();

  return json({ judges, states });
}

export const meta: MetaFunction = () => ({
  title: "评测机管理 - HITwh OJ",
});

export default function JudgeAdmin() {
  const loaderData = useSignalLoaderData<typeof loader>();
  const judges = useComputed(() => loaderData.value.judges);
  const states = useComputed(() => loaderData.value.states);

  return (
    <>
      <h1>评测机管理</h1>

      <div className="stats w-full">
        <div className="stat">
          <div className="stat-title">在线评测机</div>
          <div className="stat-value">
            {
              states.value.filter(({ state }) => state.status === "Online")
                .length
            }
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">掉线评测机</div>
          <div className="stat-value">
            {
              states.value.filter(({ state }) => state.status === "Offline")
                .length
            }
          </div>
        </div>
      </div>

      {judges.value.map((judge) => {
        const state = states.value.find((s) => s.id === judge.id)?.state;

        return (
          <div className="not-prose card bg-base-200 my-4" key={judge.id}>
            <div className="card-body">
              <h2 className="card-title">{judge.name}</h2>
              <p className="flex gap-4">
                {state?.status === "Online" ? (
                  <span className="text-success">在线</span>
                ) : (
                  <span className="text-error">离线</span>
                )}
                <span className="opacity-60">
                  {judge.ip}:{judge.port}
                </span>
              </p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  onClick={() => alert("TODO: 还没写")}
                >
                  重连
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

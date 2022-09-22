import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useParams,
  useTransition,
} from "@remix-run/react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { json } from "@remix-run/node";
import Fullscreen from "~/src/Fullscreen";
import { invariant } from "~/utils/invariant";
import { contentScheme, idScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { findRequestUser } from "~/utils/permission";
import { findContestTeam } from "~/utils/db/contest";
import { Permissions } from "~/utils/permission/permission";
import { useContext, useEffect } from "react";
import { ToastContext } from "~/utils/context/toast";

export async function loader({ params, request }: LoaderArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_SUBMIT_CONTEST_CLARIFICATION);

  const problems = await db.contestProblem.findMany({
    where: { contestId },
    select: {
      rank: true,
      problem: {
        select: {
          title: true,
        },
      },
    },
  });
  return json({
    problems,
  });
}

export default function ClarificationSubmit() {
  const { problems } = useLoaderData<typeof loader>();
  const { contestId } = useParams();
  const { state, type } = useTransition();
  const isActionSubmit = state === "submitting" && type === "actionSubmission";
  const isActionReload = state === "loading" && type === "actionReload";
  const isLoading = isActionSubmit || isActionSubmit;

  const Toasts = useContext(ToastContext);

  useEffect(() => {
    if (isActionReload) {
      Toasts.success("提交成功");
    }
  }, [isActionReload]);

  return (
    <Fullscreen
      visible={true}
      className="flex flex-col items-center justify-start bg-base-100"
    >
      <div className="w-full max-w-2xl p-4">
        <div>
          <Link
            className="btn btn-ghost gap-2"
            to={`/contest/${contestId}/clarification`}
          >
            <HiOutlineChevronLeft />
            <span>返回</span>
          </Link>
        </div>

        <h2>提交反馈</h2>

        <Form method="post" className="form-control gap-4">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">反馈题目</span>
            </label>
            <select
              className="select select-bordered"
              name="rank"
              defaultValue=""
              required
            >
              <option value="" disabled>
                请选择题目
              </option>
              {problems.map((p) => (
                <option key={p.rank} value={p.rank}>
                  {`${String.fromCharCode(0x40 + p.rank)} - ${p.problem.title}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">反馈内容</span>
            </label>
            <textarea
              className="textarea h-24 textarea-bordered"
              name="content"
              required
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              提交
            </button>
          </div>
        </Form>
      </div>
    </Fullscreen>
  );
}

export async function action({ request, params }: ActionArgs) {
  const contestId = invariant(idScheme, params.contestId, { status: 404 });
  const self = await findRequestUser(request);
  await self
    .team(await findContestTeam(contestId))
    .contest(contestId)
    .checkPermission(Permissions.PERM_SUBMIT_CONTEST_CLARIFICATION);

  const form = await request.formData();
  const rank = invariant(idScheme, form.get("rank"));
  const content = invariant(contentScheme, form.get("content"));

  const clarification = await db.clarification.create({
    data: {
      contestId,
      userId: self.userId!,
      content,
      rank: rank,
    },
    select: { id: true },
  });

  return redirect(`/contest/${contestId}/clarification/${clarification.id}`);
}
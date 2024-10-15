import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useSignal } from "@preact/signals-react";
import { Form } from "@remix-run/react";
import { invariant } from "~/utils/invariant";
import { emailScheme } from "~/utils/scheme";
import { db } from "~/utils/server/db.server";
import { useToasts } from "~/utils/toast";
import { useEffect } from "react";
import { useSignalTransition } from "~/utils/hooks";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();

  const email = invariant(emailScheme, form.get("email"));

  if (!email) {
    return json({ reason: "Email is required" }, 400);
  }

  const user = await db.user.findMany({
    where: { email },
    select: { username: true, id: true, studentId: true },
  });

  if (user.length === 0) {
    return json({ reason: "该邮箱没有绑定用户" }, 400);
  }

  var nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    secure: true,
    auth: {
      user: "1914870249@qq.com",
      pass: "cdrbzsytbmrwdceh",
    },
  });

  var mailOptions = {
    from: "1914870249@qq.com",
    to: email,
    subject: "HITWHOJ 重置密码",
    html: `<p>请点击以下链接重置您的密码：</p><a href="http://localhost:8080/password/?username=${user[0].username}">重置密码</a>`,
  };

  transporter.sendMail(mailOptions, (err: any, info: { response: any }) => {
    if (err) {
      console.log(err);
      return json({ reason: "发送失败" }, 400);
    } else {
      console.log(info.response);
      return json({ reason: "发送成功" }, 200);
    }
  });
  return json({ reason: "发送成功" }, 200);
}

export const meta: MetaFunction = () => ({
  title: "重置密码 - HITwh OJ",
});

export default function ResetPassword() {
  const email = useSignal("");
  const isEmailValid = useSignal(true); // 追踪邮箱格式是否有效

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱格式正则表达式
    return re.test(email);
  };

  const Toasts = useToasts();
  const transition = useSignalTransition();
  useEffect(() => {
    if (transition.actionSuccess) {
      Toasts.success("邮件发送成功，请到学生邮箱查收");
    }
  }, [transition.actionSuccess]);

  return (
    <>
      <h1>忘记密码</h1>
      <p>请，努力地回想起来！</p>
      <Form
        method="post"
        className="not-prose form-control w-full max-w-xs gap-4"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">用户邮箱</span>
          </label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="text"
            name="email"
            value={email.value}
            onChange={(event) => {
              email.value = event.currentTarget.value;
              isEmailValid.value = validateEmail(event.currentTarget.value);
            }}
            required
          />
          {!isEmailValid.value && (
            <label className="label-text-alt text-error">邮箱格式不对</label>
          )}
        </div>

        <div className="form-control">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!isEmailValid.value}
          >
            找回密码
          </button>
        </div>
      </Form>
    </>
  );
}

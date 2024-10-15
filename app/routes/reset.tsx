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

  const nodemailer = require("nodemailer");
  const jwt = require("jsonwebtoken");
  const transporter = nodemailer.createTransport({
    host: process.env["EMAIL_SMTP"],
    secureConnection: true,
    port: 465,
    secure: true,
    auth: {
      user: process.env["EMAIL_ADDRESS"],
      pass: process.env["EMAIL_PASS"],
    },
  });

  const payload = {
    username: user[0].username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 一小时
  };
  const resetToken = jwt.sign(payload, process.env["JWT_KEY"]);
  var mailOptions = {
    from: process.env["EMAIL_ADDRESS"],
    to: email,
    subject: "HITWHOJ 重置密码",
    html: `
        <h2>重置密码，请点击下面的链接</h2>
        <h3>重置密码请在1小时内完成，否则将失效</h3>
        <p>请点击以下链接重置您的密码：</p><a href="${process.env["SERVER_ADDRESS"]}/password/?token=${resetToken}">重置密码</a>
        <br><br><hr>
        <div>HITwh OJ 项目组和 HITwh FP 项目组绝赞纳新中！！！</div>
        <div>需要熟悉 nodejs 开发环境，有 React 开发经验，有热情学习最新最前沿的前端技术栈。</div>
        <div style="color:blue">详情请联系 QQ 64174234（张老师）或者 QQ 2516844846（史家鸣）。</div>
        `,
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

import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "重置密码 - HITwh OJ",
});

export default function ResetPassword() {
  return (
    <>
      <h1>忘记密码</h1>
      <p>请，努力地回想起来！</p>
    </>
  );
}

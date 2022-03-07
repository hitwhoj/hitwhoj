import {
  ActionFunction,
  Form,
  MetaFunction,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { commitSession } from "~/utils/sessions";

export const meta: MetaFunction = () => ({
  title: "Login",
});

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const nickname = form.get("nickname")?.toString();
  const password = form.get("password")?.toString();

  if (!nickname || !password) {
    return new Response("Nickname or password is missing", { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { nickname },
    select: { password: true, uid: true },
  });

  if (!user) {
    return new Response("Nickname is not registered", { status: 400 });
  }

  if (user.password !== password) {
    return new Response("Password is incorrect", { status: 400 });
  }

  return redirect(`/user/${user.uid}`, {
    headers: {
      "Set-Cookie": await commitSession(user.uid),
    },
  });
};

export default function Login() {
  const error = useActionData<string>();
  const { state } = useTransition();

  return (
    <>
      <h2>Login</h2>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input type="text" name="nickname" placeholder="Nickname" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sign in..." : "Sign in"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </>
  );
}

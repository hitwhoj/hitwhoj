import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { commitSession } from "~/utils/sessions";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const nickname = form.get("nickname")?.toString();
  const password = form.get("password")?.toString();
  const password2 = form.get("password2")?.toString();

  if (!nickname || !password || !password2) {
    return new Response("Nickname or password is missing", { status: 400 });
  }

  if (password !== password2) {
    return new Response("Passwords do not match", { status: 400 });
  }

  if (await db.user.findUnique({ where: { nickname } })) {
    return new Response("Nickname is already taken", { status: 400 });
  }

  const { uid } = await db.user.create({ data: { nickname, password } });

  return redirect(`/user/${uid}`, {
    headers: {
      "Set-Cookie": await commitSession(uid),
    },
  });
};

export default function Register() {
  const error = useActionData<string>();
  const { state } = useTransition();

  return (
    <>
      <h2>Register</h2>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input type="text" name="nickname" placeholder="Nickname" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          required
        />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sign up..." : "Sign up"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </>
  );
}

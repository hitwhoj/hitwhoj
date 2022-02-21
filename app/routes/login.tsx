import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { getUserByNickname } from "~/modules/user/profile";
import { createUserSession } from "~/modules/user/session";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const nickname = form.get("nickname") as string | null;
  const password = form.get("password") as string | null;

  if (!nickname || !password) {
    return json("Nickname or password is missing", { status: 400 });
  }

  const user = await getUserByNickname(nickname);

  if (!user) {
    return json("Nickname is not registered", { status: 400 });
  }

  if (user.password !== password) {
    return json("Password is incorrect", { status: 400 });
  }

  const { session } = await createUserSession(user.uid);

  return redirect(`/user/${user.uid}`, {
    headers: {
      // issue for ten years
      "Set-Cookie": `session=${session}; Path=/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 365 * 10
      ).toUTCString()}; HttpOnly`,
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
          Sign in
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </>
  );
}

import {
  ActionFunction,
  Form,
  json,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { createUser, getUserByNickname } from "~/modules/user/profile";
import { createUserSession } from "~/modules/user/session";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const nickname = form.get("nickname") as string | null;
  const password = form.get("password") as string | null;
  const password2 = form.get("password2") as string | null;

  if (!nickname || !password || !password2) {
    return json("Nickname or password is missing", { status: 400 });
  }

  if (password !== password2) {
    return json("Passwords do not match", { status: 400 });
  }

  if (await getUserByNickname(nickname)) {
    return json("Nickname is already taken", { status: 400 });
  }

  const { uid } = await createUser({ nickname, password });
  const { session } = await createUserSession(uid);

  return redirect(`/user/${uid}`, {
    headers: {
      // issue for ten years
      "Set-Cookie": `session=${session}; Path=/; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 365 * 10
      ).toUTCString()}; HttpOnly`,
    },
  });
};

export default function Register() {
  const error = useActionData<string>();
  const { state } = useTransition();

  return (
    <>
      <h2>Register</h2>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
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
          Sign up
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </>
  );
}

import {
  ActionFunction,
  Form,
  MetaFunction,
  redirect,
  useActionData,
  useSearchParams,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";

export const meta: MetaFunction = () => ({
  title: "Login",
});

function parseRedirectPathname(redirect: unknown) {
  return typeof redirect === "string" && redirect.startsWith("/")
    ? redirect
    : "/";
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const username = invariant(usernameScheme.safeParse(form.get("username")));
  const password = invariant(passwordScheme.safeParse(form.get("password")));

  const user = await db.user.findUnique({
    where: { username },
    select: { password: true, uid: true },
  });

  if (!user) {
    return new Response("Username is not registered", { status: 400 });
  }

  if (user.password !== password) {
    return new Response("Password is incorrect", { status: 400 });
  }

  return redirect(parseRedirectPathname(form.get("redirect")), {
    headers: {
      "Set-Cookie": await commitSession(user.uid),
    },
  });
};

export default function Login() {
  const error = useActionData<string>();
  const { state } = useTransition();
  const [searchParams] = useSearchParams();

  return (
    <>
      <h2>Login</h2>
      <Form method="post" style={{ display: "flex", flexDirection: "column" }}>
        <input type="text" name="username" placeholder="Username" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input
          type="hidden"
          name="redirect"
          value={parseRedirectPathname(searchParams.get("redirect"))}
        />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sign in..." : "Sign in"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
    </>
  );
}

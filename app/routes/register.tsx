import {
  ActionFunction,
  Form,
  Link,
  MetaFunction,
  redirect,
  useActionData,
  useSearchParams,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { invariant } from "~/utils/invariant";
import { guaranteePermission, Permissions } from "~/utils/permission";
import { passwordScheme, usernameScheme } from "~/utils/scheme";
import { commitSession } from "~/utils/sessions";
import { parseRedirectPathname } from "~/utils/tools";

export const meta: MetaFunction = () => ({
  title: "注册 - HITwh OJ",
});

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const username = invariant(usernameScheme.safeParse(form.get("username")));
  const password = invariant(passwordScheme.safeParse(form.get("password")));
  const password2 = invariant(passwordScheme.safeParse(form.get("password2")));

  if (password !== password2) {
    return new Response("Passwords do not match", { status: 400 });
  }

  await guaranteePermission(request, Permissions.User.Session.Create);

  if (await db.user.findUnique({ where: { username } })) {
    return new Response("username is already taken", { status: 400 });
  }

  const { uid } = await db.user.create({ data: { username, password } });

  return redirect(parseRedirectPathname(form.get("redirect")), {
    headers: {
      "Set-Cookie": await commitSession(uid),
    },
  });
};

export default function Register() {
  const error = useActionData<string>();
  const { state } = useTransition();
  const [searchParams] = useSearchParams();

  const redirect = parseRedirectPathname(searchParams.get("redirect"));

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
        <input type="text" name="username" placeholder="Username" required />
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
        <input type="hidden" name="redirect" value={redirect} />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sign up..." : "Sign up"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </Form>
      <Link to={redirect === "/" ? "/login" : `/login?redirect=${redirect}`}>
        Log in
      </Link>
    </>
  );
}

export { ErrorBoundary } from "~/src/ErrorBoundary";
export { CatchBoundary } from "~/src/CatchBoundary";

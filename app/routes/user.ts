import Router from "koa-router";
import { Types } from "../utils";
import { Users } from "../modules/user";
import type { State, Tools } from "../router";

const router = new Router<State, Tools>();

router.post("/whoami", async (ctx) => {
  if (!ctx.state.username) return ctx.fail("user/login_required");

  const profile = await Users.getUserProfile(ctx.state.username);
  if (!profile.ok) return ctx.fail(profile.error);

  ctx.end(200, profile.result);
});

router.post("/signin", async (ctx) => {
  if (ctx.state.username) return ctx.fail("user/logout_required");

  const username = ctx.data.body("username", Types.String) ?? "";
  const password = ctx.data.body("password", Types.String) ?? "";

  if (!username || !password) return ctx.fail("common/wrong_arguments");

  const success = await Users.verifyUser(username, password);
  if (!success.ok) return ctx.fail(success.error);
  if (!success.result) return ctx.fail("user/password_wrong");

  // issue a cookie for a month
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const cookie = await Users.issueCookie(username, expires);
  if (!cookie) return ctx.fail("core/database_panicked");
  ctx.cookies.set("auth", cookie, {
    httpOnly: true,
    expires,
  });

  const profile = await Users.getUserProfile(username);
  if (!profile.ok) return ctx.fail(profile.error);

  ctx.end(200, profile.result);
});

router.post("/signup", async (ctx) => {
  if (ctx.state.username) return ctx.fail("user/logout_required");

  const username = ctx.data.body("username", Types.String) ?? "";
  const password = ctx.data.body("password", Types.String) ?? "";
  const email = ctx.data.body("email", Types.String) ?? "";

  if (!username || !password || !email)
    return ctx.fail("common/wrong_arguments");

  if (!/^\w+$/i.test(username)) {
    return ctx.fail("user/invalid_username");
  }

  const profile = await Users.addUser(username, password, email);
  if (!profile.ok) return ctx.fail(profile.error);

  // issue a cookie for a month
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const cookie = await Users.issueCookie(username, expires);
  if (!cookie) return ctx.fail("core/database_panicked");
  ctx.cookies.set("auth", cookie, {
    httpOnly: true,
    expires,
  });

  ctx.end(200, profile.result);
});

export default router;

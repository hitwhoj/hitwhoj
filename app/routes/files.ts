import Router from "koa-router";
import { Users } from "../modules/user";
import type { State, Tools } from "../router";

const router = new Router<State, Tools>();

router.post("/upload", async (ctx) => {
  if (!ctx.state.username) {
    return ctx.fail("user/login_required");
  }

  const file = ctx.data.file("file");
  if (!file) {
    return ctx.fail("common/wrong_arguments");
  }

  const result = await Users.createPrivateFile(ctx.state.username, file);
  if (!result.ok) {
    return ctx.fail(result.error);
  }

  ctx.end(200, result.result);
});

router.post("/files", async (ctx) => {
  if (!ctx.state.username) {
    return ctx.fail("user/login_required");
  }

  const files = await Users.getUserFiles(ctx.state.username);

  ctx.end(200, files);
});

export default router;

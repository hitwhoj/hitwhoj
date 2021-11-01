import Router, { RouterContext } from "koa-router";
import { Storage } from "../modules/storage";
import type { State, Tools } from "../router";
import { encodeRFC5987ValueChars, Types } from "../utils";
import path from "path";

const router = new Router<State, Tools>();

const inlineWhiteList = ["application/pdf"];

async function sendFile(ctx: RouterContext<State, Tools>, filename: string) {
  const stat = await Storage.statFile(filename);
  if (!stat.ok) return ctx.fail(stat.error);

  let contentType =
    stat.result.metaData.contenttype || "application/octet-stream";
  let disposition = "attachment";

  if (contentType.startsWith("text/")) contentType = "text/plain";

  if (
    contentType.startsWith("video/") ||
    contentType.startsWith("audio/") ||
    contentType.startsWith("image/") ||
    contentType.startsWith("text/") ||
    inlineWhiteList.indexOf(contentType) > -1
  ) {
    disposition = "inline";
  }

  const rg = ctx.request.get("Range");
  if (rg) {
    const range = [0, stat.result.size - 1, stat.result.size];
    if (rg && rg.startsWith("bytes=")) {
      const [st, ed] = rg.slice(6).split("-");
      if (st) range[0] = Number(st);
      if (ed) range[1] = Number(ed);
    }

    if (
      isNaN(range[0]) ||
      isNaN(range[1]) ||
      range[0] < 0 ||
      range[1] >= stat.result.size ||
      range[0] > range[1]
    ) {
      ctx.response.status = 400;
      ctx.response.body = "BAD REQUEST";
      return;
    }

    const stream = await Storage.readFilePartial(
      filename,
      range[0],
      range[1] - range[0] + 1
    );
    if (!stream.ok) return ctx.fail(stream.error);

    ctx.response.status = 206;
    ctx.set("Content-Type", contentType);
    ctx.set("Content-Length", String(range[1] - range[0] + 1));
    ctx.set("Accept-Ranges", "bytes");
    ctx.set("Cache-Control", "max-age=31536000");
    ctx.set("Content-Range", `bytes ${range[0]}-${range[1]}/${range[2]}`);
    ctx.response.body = stream.result;
  } else {
    const stream = await Storage.readFile(filename);
    if (!stream.ok) return ctx.fail(stream.error);

    ctx.response.status = 200;
    ctx.response.set("Content-Type", contentType);
    ctx.response.set("Content-Length", String(stat.result.size));
    ctx.response.set("Accept-Ranges", "bytes");
    ctx.response.set("Cache-Control", "max-age=31536000");
    ctx.response.set(
      "Content-Disposition",
      disposition +
        "; filename*=UTF-8''" +
        encodeRFC5987ValueChars(
          stat.result.metaData.filename || path.basename(filename)
        )
    );
    ctx.response.body = stream.result;
  }
}

router.get("/user/:username/:uuid", async (ctx) => {
  if (!ctx.state.username) {
    return ctx.fail("user/login_required");
  }
  const username = ctx.data.param("username", Types.String) ?? "";
  const uuid = ctx.data.param("uuid", Types.String) ?? "";

  if (!username || !uuid) {
    return ctx.fail("common/wrong_arguments");
  }

  if (username !== ctx.state.username) {
    return ctx.fail("storage/permission_denied");
  }

  const filename = `/user/${username}/${uuid}`;

  await sendFile(ctx, filename);
});

export default router;

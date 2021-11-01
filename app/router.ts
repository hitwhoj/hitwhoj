/* eslint-disable @typescript-eslint/no-explicit-any */
import Router from "koa-router";
import type { File } from "formidable";
import { Errors } from "./errors";
import { Users } from "./modules/user";
import { getStatus, Types, validator } from "./utils";

import user from "./routes/user";
import files from "./routes/files";
import storage from "./routes/storage";

export type State = {
  username: string;
};

export type { File };

export type Tools = {
  end<T extends {}>(status: number, data: T): void;
  fail(error: Errors): void;
  data: {
    param(name: string, type: Types.String): string | null;
    param(name: string, type: Types.Number): number | null;
    param(name: string, type: Types.StringArray): string[] | null;
    param(name: string, type: Types.NumberArray): number[] | null;
    query(name: string, type: Types.String): string | null;
    query(name: string, type: Types.Number): number | null;
    query(name: string, type: Types.StringArray): string[] | null;
    query(name: string, type: Types.NumberArray): number[] | null;
    body(name: string, type: Types.String): string | null;
    body(name: string, type: Types.Number): number | null;
    body(name: string, type: Types.StringArray): string[] | null;
    body(name: string, type: Types.NumberArray): number[] | null;
    file(name: string): File | null;
    files(name: string): File[] | null;
  };
};

const router = new Router<State, Tools>();

router.use("/", async (ctx, next) => {
  ctx.state.username = "";

  const auth = ctx.cookies.get("auth");
  if (typeof auth === "string") {
    const username = await Users.findCookie(auth);
    if (typeof username === "string") {
      ctx.state.username = username;
    }
  }

  ctx.end = <T>(status: number, data: T) => {
    ctx.response.status = status;
    ctx.response.set("Content-Type", "application/json");
    ctx.response.body = JSON.stringify(data);
  };

  ctx.fail = (error: Errors) => {
    ctx.response.status = getStatus(error);
    ctx.response.set("Content-Type", "text/plain");
    ctx.response.body = error;
  };

  function parse(body: any) {
    return (name: string, type: Types) => {
      const value = body?.[name];
      if (validator(type)(value)) {
        return value;
      }
      return null;
    };
  }

  ctx.data = {
    param: parse(ctx.params),
    query: parse(ctx.request.query),
    body: parse(ctx.request.body),
    file: (name: string) => {
      const file = ctx.request.files?.[name];
      if (!file) return null;
      return Array.isArray(file) ? file[0] : file;
    },
    files: (name: string) => {
      const file = ctx.request.files?.[name];
      if (!file) return null;
      return Array.isArray(file) ? file : [file];
    },
  };

  await next();
});

router.use("/api", user.routes(), user.allowedMethods());
router.use("/api", files.routes(), files.allowedMethods());
router.use("/fs", storage.routes(), storage.allowedMethods());

export default router;

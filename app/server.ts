/* eslint-disable @typescript-eslint/ban-ts-comment */
import Koa from "koa";
import router from "./router";
import body from "koa-body";
import serve from "koa-static";
import cors from "@koa/cors";
import config from "../config.json";
import https from "https";
import c2k from "koa-connect";
import { createServer, ViteDevServer } from "vite";
import { promises as fs } from "fs";
import compress from "koa-compress";
import logger from "./logger";

const d = logger("main");

// @ts-ignore
import { render as SSRRender } from "../dist/server/entry-server.js";

const app = new Koa();

const isProd = !process.env.DEV;
d.info(`working in ${isProd ? "production" : "development"} mode`);

let vite: ViteDevServer;
if (!isProd) {
  vite = await createServer({
    root: ".",
    logLevel: "error",
    server: {
      middlewareMode: true,
    },
  });
  // use vite's connect instance as middleware
  app.use(c2k(vite.middlewares));
  d.info("ViteDevServer is working");
} else {
  app.use(compress());
  app.use(serve("dist/client", { index: false }));
}

app.use(async (ctx, next) => {
  await next();
  d.info(
    `${ctx.ip} ${ctx.status} ${ctx.method} ${ctx.path} ${ctx.get("User-Agent")}`
  );
});

// CORS start ========

if (isProd && config.cors.enable) {
  d.info("CORS stricted to " + config.cors.host);
  app.use(cors({ origin: config.cors.host }));
}

// CORS end ========

// HSTS start ========

const hsts: Koa.Middleware = async (ctx, next) => {
  ctx.response.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  await next();
};

if (config.https.enable && config.https.hsts) {
  d.info("HSTS enabled");
  app.use(hsts);
}

// HSTS end ========

app.on("error", (e) => {
  if (!(e instanceof Error)) return;
  if (/ECONNRESET/i.test(e.message)) return;
  d.error(e.message);
});

app.use(body({ multipart: true }));
app.use(serve("public"));
app.use(serve("static"));

app.use(router.routes());
app.use(router.allowedMethods());

// SSR start =================

const indexProd = isProd
  ? await fs.readFile("dist/client/index.html", "utf-8")
  : "";

// @ts-ignore
import SSRManifest from "../dist/client/ssr-manifest.json";

const manifest = isProd ? SSRManifest : {};

app.use(async (ctx) => {
  try {
    const url = ctx.req.url || "/";

    let template,
      render: (
        url: string,
        manifest: Record<string, string[]>,
        config: Partial<{ cookie: string; host: string }>
      ) => Promise<[string, string, string, string, number, string]>;
    if (!isProd) {
      // always read fresh template in dev
      template = await fs.readFile("index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/entry-server.ts")).render;
    } else {
      template = indexProd;
      render = SSRRender;
    }
    const cookie = ctx.get("Cookie");
    const host = `${config.https.enable ? "https" : "http"}://localhost${
      (config.https.enable && config.port === 443) || config.port === 80
        ? ""
        : ":" + config.port
    }`;

    const [appHtml, preloadLinks, metadata, initialState, status, lang] =
      await render(url, manifest, {
        cookie,
        host,
      });

    const html = template
      .replace("<html>", `<html lang="${lang}">`)
      .replace(
        `<!-- preload-links -->`,
        isProd ? metadata + initialState + preloadLinks : preloadLinks
      )
      .replace(`<!-- app-html -->`, appHtml);

    ctx.response.status = status;
    ctx.response.set("Content-Type", "text/html");
    ctx.response.body = html;
  } catch (e) {
    if (!(e instanceof Error)) return;
    vite && vite.ssrFixStacktrace(e);
    d.error(`SSR failed to path ${ctx.path}`);
    e.stack && d.error(e.stack);
    ctx.response.status = 500;
    ctx.response.set("Content-Type", "text/html");
    ctx.response.body = e.stack;
  }
});

// SSR end =================

// HTTPS start =================

if (config.https.enable) {
  const server = https.createServer(
    {
      key: await fs.readFile(config.https.key),
      cert: await fs.readFile(config.https.cert),
    },
    app.callback()
  );
  server.listen(config.port);

  d.info(
    `HTTPS Server started on https://localhost${
      config.port === 443 ? "" : `:${config.port}`
    }/`
  );

  if (config.https.redirect) {
    const jump = new Koa();
    jump.use(hsts);
    jump.use(async (ctx) => {
      ctx.response.status = 301;
      ctx.response.set("Location", "https://" + ctx.host + ctx.url);
    });
    jump.listen(80);

    d.info("HTTP server started on http://localhost/");
  }
} else {
  app.listen(config.port);

  d.info(
    `HTTP server started on http://localhost${
      config.port === 80 ? "" : `:${config.port}`
    }/`
  );
}

// HTTPS end =================

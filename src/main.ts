import { createSSRApp, createApp as createVueApp } from "vue";
import App from "./App.vue";
import { createRouter } from "./router";
import { createStore } from "./store";
import { createAPI } from "./api";
import { APICoreConfig } from "./api/utils";

import I18nPlugin from "./plugins/i18n";

export function createApp(config?: APICoreConfig) {
  const app = (import.meta.env.SSR ? createSSRApp : createVueApp)(App);
  const router = createRouter();
  const api = createAPI(config);
  const store = createStore(api);
  app.use(store);
  app.use(router);

  app.use(I18nPlugin);

  return { app, router, store };
}

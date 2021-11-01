import { createApp } from "./main";

const { app, router, store } = createApp();

const isSSR = "__INITIAL_STATE__" in window;

if (isSSR) {
  store.replaceState((window as any)["__INITIAL_STATE__"]);
}

router.isReady().then(() => {
  app.mount("#app", isSSR);
});

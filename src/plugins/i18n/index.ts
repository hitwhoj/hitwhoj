import { App } from "vue";
import Translate from "./Translate.vue";

export default {
  install(app: App) {
    app.component("translate", Translate);
  },
};

import { APICoreConfig, createAPICore } from "./utils";
import { createUserAPI } from "./user";

export function createAPI(config?: APICoreConfig) {
  const core = createAPICore(config);

  return {
    user: createUserAPI(core),
  };
}

export type API = ReturnType<typeof createAPI>;

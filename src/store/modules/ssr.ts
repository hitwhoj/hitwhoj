import { API } from "../../api";

export type State = {
  status: number;
  title: string;
  meta: Record<string, string>;
};

export type Getters = {};

export type Mutations<S = State> = {
  "ssr/status"(state: S, payload: number): void;
  "ssr/title"(state: S, payload: string): void;
  "ssr/meta"(state: S, payload: { name: string; content: string }): void;
};

export type Actions = {};

export function createSSRModule(_api: API) {
  const state = (): State => ({
    status: 200,
    title: "Example Title",
    meta: {},
  });

  const getters: Getters = {};

  const mutations: Mutations = {
    "ssr/status"(state, payload) {
      state.status = payload;
    },
    "ssr/title"(state, payload) {
      state.title = payload;
      if (!import.meta.env.SSR) {
        document.title = payload;
      }
    },
    "ssr/meta"(state, payload) {
      state.meta[payload.name] = payload.content;
    },
  };

  const actions: Actions = {};

  return {
    state,
    getters,
    mutations,
    actions,
  };
}

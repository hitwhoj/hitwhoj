import { ArgumentedActionContext as ActionContext } from "..";
import { UserFilesDoc } from "../../../app/modules/user";
import { API } from "../../api";

export type State = {
  username: string;
  email: string;
  files: UserFilesDoc[] | null;
};

export type Mutations<S = State> = {
  "user/update"(state: S, payload: { username: string; email: string }): void;
  "user/set_files"(state: S, payload: UserFilesDoc[] | null): void;
};

export type Actions<S = State> = {
  "user/whoami"(actx: ActionContext<S>): Promise<boolean>;
  "user/signin"(
    actx: ActionContext<S>,
    payload: {
      username: string;
      password: string;
    }
  ): Promise<boolean>;
  "user/signup"(
    actx: ActionContext<S>,
    payload: {
      username: string;
      password: string;
      email: string;
    }
  ): Promise<boolean>;
  "user/upload"(actx: ActionContext<S>, payload: File): Promise<boolean>;
  "user/files"(actx: ActionContext<S>): Promise<void>;
};

export function createUserModule(api: API) {
  const state = (): State => ({
    username: "",
    email: "",
    files: null,
  });

  const mutations: Mutations = {
    "user/update"(state, payload) {
      state.username = payload.username;
      state.email = payload.email;
    },
    "user/set_files"(state, payload) {
      state.files = payload;
    },
  };

  const actions: Actions = {
    async "user/whoami"({ commit }) {
      const res = await api.user.whoami();
      if (res.status === 200) {
        commit("user/update", {
          username: res.data._id,
          email: res.data.email,
        });
        return true;
      } else {
        return false;
      }
    },

    async "user/signin"({ commit }, payload) {
      const res = await api.user.signIn(payload.username, payload.password);
      if (res.status === 200) {
        commit("user/update", {
          username: payload.username,
          email: res.data.email,
        });
        return true;
      } else {
        return false;
      }
    },

    async "user/signup"({ commit }, payload) {
      const res = await api.user.signUp(
        payload.username,
        payload.password,
        payload.email
      );
      if (res.status === 200) {
        commit("user/update", {
          username: payload.username,
          email: payload.email,
        });
        return true;
      } else {
        return false;
      }
    },

    async "user/upload"(_, username) {
      const res = await api.user.uploadFile(username);
      return res.status === 200;
    },

    async "user/files"({ commit }) {
      const res = await api.user.getFiles();
      if (res.status === 200) {
        commit("user/set_files", res.data);
      }
    },
  };

  return {
    state,
    mutations,
    actions,
  };
}

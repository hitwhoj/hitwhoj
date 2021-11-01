import { AbstractGetter, ArgumentedActionContext as ActionContext } from "..";
import { UserFilesDoc, UserProfileDoc } from "../../../app/modules/user";
import { API } from "../../api";

export type State = {
  profile: UserProfileDoc | null;
  files: UserFilesDoc[] | null;
};

export type Getters<S = State> = {
  username(state: S): string | null;
};

export type Mutations<S = State> = {
  "user/update"(state: S, payload: UserProfileDoc): void;
  "user/set_files"(state: S, payload: UserFilesDoc[] | null): void;
};

export type Actions<S = State, G extends AbstractGetter = Getters> = {
  "user/whoami"(actx: ActionContext<S, G>): Promise<boolean>;
  "user/signin"(
    actx: ActionContext<S, G>,
    payload: {
      username: string;
      password: string;
    }
  ): Promise<boolean>;
  "user/signup"(
    actx: ActionContext<S, G>,
    payload: {
      username: string;
      password: string;
      email: string;
    }
  ): Promise<boolean>;
  "user/upload"(actx: ActionContext<S, G>, payload: File): Promise<boolean>;
  "user/files"(actx: ActionContext<S, G>): Promise<void>;
};

export function createUserModule(api: API) {
  const state = (): State => ({
    profile: null,
    files: null,
  });

  const getters: Getters = {
    username(state) {
      return state.profile ? state.profile._id : null;
    },
  };

  const mutations: Mutations = {
    "user/update"(state, payload) {
      state.profile = payload;
    },
    "user/set_files"(state, payload) {
      state.files = payload;
    },
  };

  const actions: Actions = {
    async "user/whoami"({ commit }) {
      const res = await api.user.whoami();
      if (res.status === 200) {
        commit("user/update", res.data);
        return true;
      } else {
        return false;
      }
    },

    async "user/signin"({ commit }, payload) {
      const res = await api.user.signIn(payload.username, payload.password);
      if (res.status === 200) {
        commit("user/update", res.data);
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
        commit("user/update", res.data);
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
    getters,
    mutations,
    actions,
  };
}

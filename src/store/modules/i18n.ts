import { AbstractGetter, ArgumentedActionContext as ActionContext } from "..";
import { API } from "../../api";
import { Languages, loadLanguage } from "../../plugins/i18n/lang";

export type State = {
  lang: Languages;
};

export type Getters = {};

export type Mutations<S = State> = {
  "i18n/change_language"(state: S, payload: Languages): void;
};

export type Actions<S = State, G extends AbstractGetter = Getters> = {
  "i18n/change_language"(
    actx: ActionContext<S, G>,
    payload: Languages
  ): Promise<void>;
};

export function createI18nModule(_api: API) {
  const state = (): State => ({
    lang: "en_us",
  });

  const getters: Getters = {};

  const mutations: Mutations = {
    "i18n/change_language"(state, payload) {
      state.lang = payload;
    },
  };

  const actions: Actions = {
    async "i18n/change_language"({ commit }, lang) {
      await loadLanguage(lang);
      commit("i18n/change_language", lang);
    },
  };

  return {
    state,
    getters,
    mutations,
    actions,
  };
}

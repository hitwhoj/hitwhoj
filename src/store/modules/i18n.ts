import { AbstractGetter, ArgumentedActionContext as ActionContext } from "..";
import { API } from "../../api";
import {
  getDefaultLanguage,
  Languages,
  loadLanguage,
  Translations,
} from "../../plugins/i18n/lang";

export type State = {
  lang: Languages;
  translation: Translations;
};

export type Getters = {};

export type Mutations<S = State> = {
  "i18n/change_language"(
    state: S,
    payload: {
      language: Languages;
      translation: Translations;
    }
  ): void;
};

export type Actions<S = State, G extends AbstractGetter = Getters> = {
  "i18n/change_language"(
    actx: ActionContext<S, G>,
    payload: Languages
  ): Promise<void>;
};

export function createI18nModule(_api: API) {
  const state = (): State => ({
    lang: "en-US",
    translation: getDefaultLanguage(),
  });

  const getters: Getters = {};

  const mutations: Mutations = {
    "i18n/change_language"(state, payload) {
      state.lang = payload.language;
      state.translation = payload.translation;
    },
  };

  const actions: Actions = {
    async "i18n/change_language"({ commit }, lang) {
      const trans = await loadLanguage(lang);
      commit("i18n/change_language", {
        language: lang,
        translation: trans,
      });

      if (!import.meta.env.SSR) {
        document.cookie = `language=${lang}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
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

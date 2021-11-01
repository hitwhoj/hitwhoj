import {
  State as UserState,
  Getters as UserGetters,
  Mutations as UserMutations,
  Actions as UserActions,
  createUserModule,
} from "./user";

import {
  State as SSRState,
  Getters as SSRGetters,
  Mutations as SSRMutations,
  Actions as SSRActions,
  createSSRModule,
} from "./ssr";

import {
  State as I18nState,
  Getters as I18nGetters,
  Mutations as I18nMutations,
  Actions as I18nActions,
  createI18nModule,
} from "./i18n";

import { API } from "../../api";

export const createModules = (api: API) => {
  return {
    user: createUserModule(api),
    ssr: createSSRModule(api),
    i18n: createI18nModule(api),
  };
};

export type ModuleState = {
  user: UserState;
  ssr: SSRState;
  i18n: I18nState;
};

export type ModuleGetters = UserGetters & SSRGetters & I18nGetters;
export type ModuleMutations = UserMutations & SSRMutations & I18nMutations;
export type ModuleActions = UserActions & SSRActions & I18nActions;

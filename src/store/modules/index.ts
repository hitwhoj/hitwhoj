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

import { API } from "../../api";

export const createModules = (api: API) => {
  return {
    user: createUserModule(api),
    ssr: createSSRModule(api),
  };
};

export type ModuleState = {
  user: UserState;
  ssr: SSRState;
};

export type ModuleGetters = UserGetters & SSRGetters;
export type ModuleMutations = UserMutations & SSRMutations;
export type ModuleActions = UserActions & SSRActions;

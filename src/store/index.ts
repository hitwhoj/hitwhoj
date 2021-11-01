import { API } from "../api";
import {
  createStore as _createStore,
  Store,
  useStore as _useStore,
} from "vuex";
import {
  createModules,
  ModuleState as RootState,
  ModuleGetters as RootGetters,
  ModuleActions as RootActions,
  ModuleMutations as RootMutations,
} from "./modules";

export const createStore = (api: API): Store<RootState> => {
  return _createStore({
    modules: createModules(api),
  });
};

type OptionalSpread<T> = T extends undefined ? [] : [T];

export type AbstractGetter = Record<string, (...args: any[]) => any>;

type FlatGetters<T extends AbstractGetter> = {
  [v in keyof T]: ReturnType<T[v]>;
};

export type ArgumentedActionContext<S, G extends AbstractGetter> = {
  commit<K extends keyof RootMutations>(
    type: K,
    ...payload: OptionalSpread<Parameters<RootMutations[K]>[1]>
  ): ReturnType<RootMutations[K]>;
  dispatch<K extends keyof RootActions>(
    type: K,
    ...payload: OptionalSpread<Parameters<RootActions[K]>[1]>
  ): ReturnType<RootActions[K]>;
  state: S;
  getters: FlatGetters<G>;
  rootState: RootState;
  rootGetters: FlatGetters<RootGetters>;
};

export type MyStore = Omit<
  Store<RootState>,
  "commit" | "dispatch" | "getters"
> & {
  commit<K extends keyof RootMutations>(
    type: K,
    ...payload: OptionalSpread<Parameters<RootMutations[K]>[1]>
  ): ReturnType<RootMutations[K]>;
  dispatch<K extends keyof RootActions>(
    type: K,
    ...payload: OptionalSpread<Parameters<RootActions[K]>[1]>
  ): ReturnType<RootActions[K]>;
  readonly getters: FlatGetters<RootGetters>;
};

export function useStore() {
  return _useStore() as MyStore;
}

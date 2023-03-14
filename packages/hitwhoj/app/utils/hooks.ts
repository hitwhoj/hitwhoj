import {
  batch,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals-react";
import {
  useFetcher as useRemixFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect } from "react";

export function useSignalTransition() {
  const transition = useTransition();

  const type = useSignal(transition.type);
  const state = useSignal(transition.state);
  const location = useSignal(transition.location);
  const submission = useSignal(transition.submission);

  useEffect(() => {
    batch(() => {
      type.value = transition.type;
      state.value = transition.state;
      location.value = transition.location;
      submission.value = transition.submission;
    });
  }, [transition.state, transition.type]);

  const loading = useComputed(() => state.value !== "idle");
  const success = useComputed(
    () =>
      state.value === "loading" &&
      (type.value === "actionRedirect" || type.value === "actionReload")
  );

  return {
    type,
    state,
    location,
    submission,

    loading,
    success,
  };
}

export function useSignalFetcher<T = any>() {
  const fetcher = useRemixFetcher<T>();

  const state = useSignal(fetcher.state);
  const type = useSignal(fetcher.type);
  const data = useSignal(fetcher.data);
  const submission = useSignal(fetcher.submission);

  useEffect(() => {
    batch(() => {
      state.value = fetcher.state;
      type.value = fetcher.type;
      data.value = fetcher.data;
      submission.value = fetcher.submission;
    });
  }, [fetcher.state, fetcher.type]);

  const idle = useComputed(() => type.value === "init");
  const done = useComputed(() => type.value === "done");
  const loading = useComputed(() => !(idle.value || done.value));

  return {
    Form: fetcher.Form,
    submit: fetcher.submit,
    load: fetcher.load,

    state,
    type,
    data,
    submission,

    loading,
    done,
    idle,
  };
}

export function useSignalLoaderData<T>() {
  const data = useLoaderData<T>();

  const loaderData = useSignal(data);

  useEffect(() => {
    loaderData.value = data;
  }, [data]);

  // convert to readonly signal
  return useComputed(() => loaderData.value);
}

/**
 * Create a Signal which can be modified, but will be overrided in case of compute() changes.
 */
export function useSynchronized<T>(compute: () => T) {
  const computed = useComputed(compute);
  const signal = useSignal(computed.value);

  useSignalEffect(() => {
    signal.value = computed.value;
  });

  return signal;
}

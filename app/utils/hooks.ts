import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { useFetcher, useLoaderData, useTransition } from "@remix-run/react";
import { useEffect } from "react";

export function useConvertToSignal<T>(t: T) {
  const signal = useSignal(t);
  useEffect(() => {
    signal.value = t;
  }, [t]);
  return signal;
}

export function useSignalTransition() {
  const transition = useTransition();

  return {
    type: transition.type,
    state: transition.state,
    location: transition.location,
    submission: transition.submission,

    isRunning:
      transition.type === "actionRedirect" ||
      transition.type === "actionReload" ||
      transition.type === "actionSubmission" ||
      transition.type === "loaderSubmission" ||
      transition.type === "loaderSubmissionRedirect" ||
      transition.type === "fetchActionRedirect",

    actionSuccess:
      transition.type === "actionReload" ||
      transition.type === "actionRedirect",
  };
}

export function useSignalFetcher<T = any>() {
  const fetcher = useFetcher<T>();

  return {
    ...fetcher,
    isRunning:
      fetcher.type === "actionRedirect" ||
      fetcher.type === "actionReload" ||
      fetcher.type === "actionSubmission",
    actionSuccess:
      fetcher.type === "actionRedirect" || fetcher.type === "actionReload",
  };
}

/**
 * This seems useless, but prepare for Qwik City
 */
export function useSignalLoaderData<T>() {
  const data = useLoaderData<T>();

  // convert to readonly signal
  return useConvertToSignal(data);
}

/**
 * Create a Signal which can be modified, but will be overrided in case of compute() changes.
 */
export function useSynchronized<T>(compute: () => T) {
  const computed = useComputed(compute);
  const signal = useSignal(computed.peek());

  useSignalEffect(() => {
    signal.value = computed.value;
  });

  return signal;
}

"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

type DebouncedCallback<Args extends unknown[]> = {
  (...args: Args): void;
  cancel: () => void;
};

/**
 * Runs `callback` once `delayMs` has passed without another call.
 *
 * A debounced *callback* rather than a debounced *value*, because a pending run
 * sometimes has to be abandoned: if the URL changes from underneath the input —
 * the back button, or a "clear filters" action — the keystroke still waiting to
 * be published is stale and would undo that change.
 *
 * The returned function keeps a stable identity across renders, so effects can
 * depend on it without re-running every time the parent renders.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
): DebouncedCallback<Args> {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current === undefined) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  }, []);

  // Never leave a timer running after the component has gone.
  useEffect(() => cancel, [cancel]);

  return useMemo(() => {
    const debounced = (...args: Args) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;
        callbackRef.current(...args);
      }, delayMs);
    };

    debounced.cancel = cancel;

    return debounced;
  }, [cancel, delayMs]);
}

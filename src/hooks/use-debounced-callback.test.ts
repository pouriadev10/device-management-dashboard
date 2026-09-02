import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedCallback } from "./use-debounced-callback";

const advance = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for the delay before running", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => result.current("router"));

    advance(299);
    expect(callback).not.toHaveBeenCalled();

    advance(1);
    expect(callback).toHaveBeenCalledExactlyOnceWith("router");
  });

  it("runs once for a burst of calls, with the last arguments", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    for (const value of ["r", "ro", "rou", "rout", "route", "router"]) {
      act(() => result.current(value));
      advance(50);
    }

    expect(callback).not.toHaveBeenCalled();

    advance(300);
    expect(callback).toHaveBeenCalledExactlyOnceWith("router");
  });

  it("drops a pending run when cancelled", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 300));

    act(() => result.current("router"));
    act(() => result.current.cancel());
    advance(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  it("keeps a stable identity across renders", () => {
    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 300),
      { initialProps: { callback: vi.fn() } },
    );

    const first = result.current;
    rerender({ callback: vi.fn() });

    expect(result.current).toBe(first);
  });

  it("calls the newest callback it was given", () => {
    const stale = vi.fn();
    const fresh = vi.fn();

    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 300),
      { initialProps: { callback: stale } },
    );

    rerender({ callback: fresh });
    act(() => result.current("router"));
    advance(300);

    expect(stale).not.toHaveBeenCalled();
    expect(fresh).toHaveBeenCalledExactlyOnceWith("router");
  });

  it("does not run after the component unmounts", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 300),
    );

    act(() => result.current("router"));
    unmount();
    advance(1000);

    expect(callback).not.toHaveBeenCalled();
  });
});

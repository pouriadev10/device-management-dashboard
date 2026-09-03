import { afterEach, describe, expect, it, vi } from "vitest";

import { startViewTransition, supportsViewTransition } from "./view-transition";

type Transition = { ready: Promise<void>; finished: Promise<void> };

/**
 * jsdom implements neither the View Transitions API nor `matchMedia`'s queries,
 * which between them are the two branches this module has. Both are stubbed
 * rather than mocked away, so the fallback path is exercised as written.
 */
function stubViewTransitions(): { finish: () => void } {
  let finish = () => {};
  const finished = new Promise<void>((resolve) => {
    finish = resolve;
  });

  vi.stubGlobal("document", document);
  Object.assign(document, {
    startViewTransition: (update: () => void): Transition => {
      update();
      return { ready: Promise.resolve(), finished };
    },
  });

  return { finish };
}

function stubReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
  }));
}

afterEach(() => {
  Reflect.deleteProperty(document, "startViewTransition");
  document.documentElement.removeAttribute("data-view-transition");
  vi.unstubAllGlobals();
});

describe("supportsViewTransition", () => {
  it("is false without the API", () => {
    expect(supportsViewTransition()).toBe(false);
  });

  it("is false when less motion has been asked for, API or not", () => {
    stubViewTransitions();
    stubReducedMotion(true);

    expect(supportsViewTransition()).toBe(false);
  });

  it("is true with the API and no such request", () => {
    stubViewTransitions();
    stubReducedMotion(false);

    expect(supportsViewTransition()).toBe(true);
  });
});

describe("startViewTransition", () => {
  it("applies the update flat when there is nothing to animate with", () => {
    const update = vi.fn();

    expect(startViewTransition(update)).toBeUndefined();
    expect(update).toHaveBeenCalledOnce();
  });

  it("runs the update inside the transition", () => {
    stubViewTransitions();
    const update = vi.fn();

    expect(startViewTransition(update)).toBeDefined();
    expect(update).toHaveBeenCalledOnce();
  });

  it("marks which change is in flight, and unmarks it when it ends", async () => {
    const { finish } = stubViewTransitions();

    const transition = startViewTransition(() => {}, "theme");
    expect(document.documentElement).toHaveAttribute(
      "data-view-transition",
      "theme",
    );

    finish();
    await transition?.finished;
    // The clean-up is chained onto `finished`, so it lands a tick later.
    await Promise.resolve();

    expect(document.documentElement).not.toHaveAttribute(
      "data-view-transition",
    );
  });

  it("marks nothing when the caller did not name the change", () => {
    stubViewTransitions();

    startViewTransition(() => {});

    expect(document.documentElement).not.toHaveAttribute(
      "data-view-transition",
    );
  });
});

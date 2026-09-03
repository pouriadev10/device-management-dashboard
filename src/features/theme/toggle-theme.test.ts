import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { THEME_ATTRIBUTE } from "./theme";
import { toggleTheme } from "./toggle-theme";

const ORIGIN = { left: 100, top: 50, width: 36, height: 36 } as DOMRect;

const root = () => document.documentElement;

/** jsdom answers every media query with `false`, so dark has to be stood in for. */
function stubSystemTheme(dark: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: dark && query.includes("prefers-color-scheme: dark"),
    media: query,
  }));
}

function stubViewTransitions() {
  Object.assign(document, {
    startViewTransition: (update: () => void) => {
      update();
      return {
        ready: Promise.resolve(),
        finished: Promise.resolve(),
        skipTransition: vi.fn(),
      };
    },
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  root().removeAttribute(THEME_ATTRIBUTE);
  root().removeAttribute("data-theme-changing");
  stubSystemTheme(false);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "startViewTransition");
  Reflect.deleteProperty(root(), "animate");
});

describe("toggleTheme", () => {
  it("moves to the opposite of what is on screen", () => {
    expect(toggleTheme(ORIGIN)).toBe("dark");
    expect(root()).toHaveAttribute(THEME_ATTRIBUTE, "dark");

    expect(toggleTheme(ORIGIN)).toBe("light");
    expect(root()).toHaveAttribute(THEME_ATTRIBUTE, "light");
  });

  it("moves away from the operating system's theme on the first press", () => {
    // Nothing has been chosen yet, so the first press has to argue with the
    // system preference rather than with a stored value.
    stubSystemTheme(true);

    expect(toggleTheme(ORIGIN)).toBe("light");
  });

  describe("without the View Transitions API", () => {
    it("cross-fades the colours instead of cutting to them", () => {
      toggleTheme(ORIGIN);

      expect(root()).toHaveAttribute("data-theme-changing");
    });

    it("stops transitioning once the fade is over", () => {
      toggleTheme(ORIGIN);

      vi.advanceTimersByTime(300);

      // Left in place it would slow down every later colour change on the page,
      // hover states included.
      expect(root()).not.toHaveAttribute("data-theme-changing");
    });
  });

  describe("with the View Transitions API", () => {
    it("clips the old theme away, collapsing it into the control that was pressed", async () => {
      const animate = vi.fn();
      Object.assign(root(), { animate });
      stubViewTransitions();

      toggleTheme(ORIGIN);
      await vi.runAllTimersAsync();

      expect(animate).toHaveBeenCalledOnce();

      const [[covered, closed], options] = animate.mock.calls[0] as [
        [{ clipPath: string }, { clipPath: string }],
        KeyframeAnimationOptions,
      ];

      // Centred on the middle of the button (118, 68) as a fraction of jsdom's
      // 1024x768 viewport, and shrinking to nothing there. Percentages so the
      // centre holds even while the snapshot box is still settling.
      const at = `at ${(118 / 1024) * 100}% ${(68 / 768) * 100}%`;
      expect(covered).toEqual({ clipPath: `circle(142% ${at})` });
      expect(closed).toEqual({ clipPath: `circle(0% ${at})` });

      // The old snapshot is a frozen bitmap; clipping it composites the same
      // whatever the page holds, which is what keeps the wipe off the far
      // corner. `both` keeps the old theme from flashing back at either end,
      // and a linear shrink closes without crawling the last few frames.
      expect(options.pseudoElement).toBe("::view-transition-old(root)");
      expect(options.fill).toBe("both");
      expect(options.easing).toBe("linear");
    });

    it("leaves the fallback fade alone", () => {
      Object.assign(root(), { animate: vi.fn() });
      stubViewTransitions();

      toggleTheme(ORIGIN);

      expect(root()).not.toHaveAttribute("data-theme-changing");
    });

    it("cancels a wipe still mid-flight rather than leaving it stuck", async () => {
      const cancel = vi.fn();
      const animate = vi.fn().mockReturnValue({ cancel });
      Object.assign(root(), { animate });

      const skipTransition = vi.fn();
      Object.assign(document, {
        startViewTransition: (update: () => void) => {
          update();
          return {
            ready: Promise.resolve(),
            // Never settles, standing in for a wipe still animating when the
            // button is pressed again.
            finished: new Promise<void>(() => {}),
            skipTransition,
          };
        },
      });

      toggleTheme(ORIGIN);
      await vi.runAllTimersAsync();

      toggleTheme(ORIGIN);

      expect(skipTransition).toHaveBeenCalledOnce();
      expect(cancel).toHaveBeenCalledOnce();
    });
  });
});

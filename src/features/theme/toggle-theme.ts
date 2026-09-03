import {
  startViewTransition,
  supportsViewTransition,
} from "@/lib/view-transition";

import { applyTheme, resolveTheme, type Theme } from "./theme";

/** Enables the colour transition in `globals.css`, for the length of one fade. */
const FADE_ATTRIBUTE = "data-theme-changing";
const FADE_MS = 260;

const WIPE_MS = 460;
/**
 * Linear on purpose. The circle is shrinking, and its own geometry already
 * softens the finish — area falls off with the square of the radius, so the
 * last stretch covers little ground however fast the radius is moving. An
 * ease-out curve on top of that (what a growing wipe would want) left a small
 * disc crawling by the button for the final frames instead of closing.
 */
const WIPE_EASING = "linear";
/** Just past the √2 that reaches the corner from a centre anywhere near one. */
const WIPE_START_RADIUS = "142%";

/**
 * The wipe currently animating, so a toggle pressed again before it settles can
 * clean it up instead of leaving it running against a snapshot the next
 * transition is about to replace — which is what left a stray circle stuck on
 * screen for a second before vanishing.
 */
let pendingWipe:
  { transition: ViewTransitionLike; animation?: Animation } | undefined;

type ViewTransitionLike = {
  finished: Promise<void>;
  skipTransition: () => void;
};

/**
 * Flips the theme, animating the change around `origin` — the rectangle of the
 * control that was pressed.
 *
 * Two ways of doing that, because they fail differently. A view transition
 * snapshots the old page and clips it away over the new one, which is the only
 * way to move an entire repaint as one object instead of watching each surface
 * change on its own. Without that API there is nothing to snapshot, so the
 * colours cross-fade in place instead: less striking, but never a hard cut.
 */
export function toggleTheme(origin: DOMRect): Theme {
  const next: Theme = resolveTheme() === "dark" ? "light" : "dark";

  // Has to be decided before the update runs, since without a view transition
  // `startViewTransition` applies it immediately.
  if (!supportsViewTransition()) {
    fadeColours();
    applyTheme(next);
    return next;
  }

  // A wipe still mid-flight would otherwise keep animating against a pseudo
  // element the transition below is about to tear down.
  pendingWipe?.animation?.cancel();
  pendingWipe?.transition.skipTransition();
  pendingWipe = undefined;

  const transition = startViewTransition(() => applyTheme(next), "theme");
  if (transition) {
    const record: { transition: ViewTransitionLike; animation?: Animation } = {
      transition,
    };
    pendingWipe = record;
    void wipeIn(transition.ready, origin).then((animation) => {
      record.animation = animation;
    });
    void transition.finished.finally(() => {
      if (pendingWipe === record) pendingWipe = undefined;
    });
  }

  return next;
}

function fadeColours(): void {
  const root = document.documentElement;

  root.setAttribute(FADE_ATTRIBUTE, "");
  window.setTimeout(() => root.removeAttribute(FADE_ATTRIBUTE), FADE_MS);
}

/** `position` as a 0–100 percentage of `extent`, or 50 when it can't be one. */
function originPercent(position: number, extent: number): number {
  if (!(extent > 0)) return 50;
  return Math.min(100, Math.max(0, (position / extent) * 100));
}

async function wipeIn(
  ready: Promise<void>,
  origin: DOMRect,
): Promise<Animation | undefined> {
  try {
    await ready;
  } catch {
    // The browser skipped the transition — another one started, or the tab was
    // hidden. The theme is applied either way, which is what matters.
    return undefined;
  }

  // Centre of the button as a fraction of the viewport. Percentages, not
  // pixels: `::view-transition-old(root)` is only *usually* the size of the
  // viewport — while the group settles on the first transition of a page it can
  // be scaled for a few frames, and a percentage rides that out where a pixel
  // offset would drop the circle's centre somewhere off the button. Falls back
  // to dead centre if the viewport can't be measured or the rect lands outside
  // it; a centred collapse still reads as deliberate.
  const at = `at ${originPercent(origin.left + origin.width / 2, window.innerWidth)}% ${originPercent(origin.top + origin.height / 2, window.innerHeight)}%`;

  // Clip the *old* snapshot, not the new page. `::view-transition-old(root)` is
  // a bitmap the browser froze before the swap, so shrinking a circle out of it
  // is a pure compositor job — it costs the same whatever the page is made of.
  // The new theme sits underneath it, painted once, already whole.
  //
  // Growing a circle into `::view-transition-new(root)` instead — the obvious
  // way round, the new theme spreading from the button — makes the browser
  // rasterise live page content along the advancing edge every frame. Anything
  // it can't paint in time (the device table, Persian text, the blurred header)
  // trails the edge, and since the edge is longest and moving fastest as it
  // clears the last corner, that far corner is exactly where the lag collects.
  //
  // `both` fills the clip in both directions: cover the viewport from the
  // moment the snapshot exists until this animation is added a frame later, and
  // hold it cleared afterwards until the transition tears the snapshot down.
  // Without it the old theme flashes back — whole at the start, or for a frame
  // at the end.
  return document.documentElement.animate(
    [
      { clipPath: `circle(${WIPE_START_RADIUS} ${at})` },
      { clipPath: `circle(0% ${at})` },
    ],
    {
      duration: WIPE_MS,
      easing: WIPE_EASING,
      fill: "both",
      pseudoElement: "::view-transition-old(root)",
    },
  );
}

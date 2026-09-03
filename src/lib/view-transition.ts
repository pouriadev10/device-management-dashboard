/**
 * Minimal surface of the View Transitions API. Declared here rather than relied
 * on from `lib.dom`, which has carried it for less time than the browsers have.
 */
type ViewTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition: () => void;
};

type StartViewTransition = (update: () => void) => ViewTransition;

type DocumentWithViewTransition = Document & {
  startViewTransition?: StartViewTransition;
};

/** Marks which change is in flight, so the stylesheet can animate it its own way. */
const KIND_ATTRIBUTE = "data-view-transition";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Whether `startViewTransition` will animate rather than apply the update flat.
 * Callers that need to arrange a fallback have to know before they change
 * anything, since by then the update has already run.
 */
export function supportsViewTransition(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as DocumentWithViewTransition).startViewTransition ===
      "function" &&
    !prefersReducedMotion()
  );
}

/**
 * Runs `update` inside a view transition where one is available, and simply
 * runs it otherwise — including when the reader has asked for less motion.
 *
 * Returns the transition so a caller can wait on `ready` and animate the
 * snapshot itself, or `undefined` when the update has already been applied
 * unanimated. That distinction is the whole API: nothing here decides what the
 * animation looks like.
 */
export function startViewTransition(
  update: () => void,
  kind?: string,
): ViewTransition | undefined {
  if (!supportsViewTransition()) {
    update();
    return undefined;
  }

  const document_ = document as Document & {
    startViewTransition: StartViewTransition;
  };
  const root = document_.documentElement;
  if (kind) root.setAttribute(KIND_ATTRIBUTE, kind);

  const transition = document_.startViewTransition(update);

  // Clearing on `finished` rather than in a timeout keeps the attribute for
  // exactly as long as the animation it is describing, however long that is.
  void transition.finished.finally(() => {
    if (kind) root.removeAttribute(KIND_ATTRIBUTE);
  });

  return transition;
}

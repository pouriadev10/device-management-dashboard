import {
  DEFAULT_LOCALE,
  LOCALE_DIRECTION,
  isRtl,
  type Direction,
  type Locale,
} from "./locales";
import { CATALOGUES, type Catalogue, type MessageKey } from "./messages";

export type MessageValues = Record<string, string | number>;

export type Translator = {
  locale: Locale;
  direction: Direction;
  /** Looks a message up, filling in `{placeholders}` from `values`. */
  t: (key: MessageKey, values?: MessageValues) => string;
  formatNumber: (value: number) => string;
  /** How long ago a device was last reachable, phrased for the locale. */
  formatRelativeMinutes: (minutes: number) => string;
};

const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * First-strong isolate and its terminator. A Latin device name or an IPv4
 * address dropped into a Persian sentence would otherwise be reordered around
 * the punctuation next to it — `Storage-NAS (192.168.1.50)` comes out with its
 * brackets swapped. Isolating each substituted value pins it in place.
 */
const ISOLATE_START = "⁨";
const ISOLATE_END = "⁩";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 60 * 24;

const translators = new Map<Locale, Translator>();

/** One translator per locale, built once and shared. */
export function getTranslator(locale: Locale): Translator {
  const existing = translators.get(locale);
  if (existing) return existing;

  const translator = createTranslator(locale);
  translators.set(locale, translator);

  return translator;
}

function createTranslator(locale: Locale): Translator {
  const catalogue = CATALOGUES[locale];
  const numberFormat = new Intl.NumberFormat(locale);
  const pluralRules = new Intl.PluralRules(locale);
  const relativeFormat = new Intl.RelativeTimeFormat(locale, {
    numeric: "always",
  });
  const isolateValues = isRtl(locale);

  const formatNumber = (value: number) => numberFormat.format(value);

  function t(key: MessageKey, values?: MessageValues): string {
    const template =
      catalogue[selectPlural(catalogue, pluralRules, key, values)];
    if (!values) return template;

    return template.replace(PLACEHOLDER, (placeholder, name: string) => {
      const value = values[name];
      if (value === undefined) return placeholder;

      const text = typeof value === "number" ? formatNumber(value) : value;

      return isolateValues ? `${ISOLATE_START}${text}${ISOLATE_END}` : text;
    });
  }

  function formatRelativeMinutes(minutes: number): string {
    if (minutes <= 0) return t("devices.lastPing.now");

    if (minutes < MINUTES_PER_HOUR) {
      return relativeFormat.format(-minutes, "minute");
    }

    if (minutes < MINUTES_PER_DAY) {
      return relativeFormat.format(
        -Math.round(minutes / MINUTES_PER_HOUR),
        "hour",
      );
    }

    return relativeFormat.format(-Math.round(minutes / MINUTES_PER_DAY), "day");
  }

  return {
    locale,
    direction: LOCALE_DIRECTION[locale],
    t,
    formatNumber,
    formatRelativeMinutes,
  };
}

/**
 * Picks the plural form for a `count`, when the catalogue offers one. English
 * needs a separate singular; Persian counts one device the same way it counts
 * four, so it simply has no `.one` entry to find.
 */
function selectPlural(
  catalogue: Catalogue,
  pluralRules: Intl.PluralRules,
  key: MessageKey,
  values: MessageValues | undefined,
): MessageKey {
  if (typeof values?.count !== "number") return key;

  const candidate = `${key}.${pluralRules.select(values.count)}`;

  return Object.hasOwn(catalogue, candidate) ? (candidate as MessageKey) : key;
}

export const defaultTranslator = getTranslator(DEFAULT_LOCALE);

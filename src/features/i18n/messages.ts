import type { Locale } from "./locales";

/**
 * English is the source catalogue: its keys are the type every other language
 * has to satisfy, so a missing or misspelled translation is a build error
 * rather than a stray English word in the middle of a Persian page.
 *
 * A `.one` key next to a plain one is its singular form. `t()` reaches for it
 * through `Intl.PluralRules`, so a language that splits its plurals differently
 * only has to add the categories it actually uses.
 */
const en = {
  "app.name": "Device Management",
  "app.tagline": "Network operations console",

  "meta.title": "Device Management Dashboard",
  "meta.titleTemplate": "%s · Device Management",
  "meta.description":
    "Monitor, filter and register the devices on your network from a single dashboard.",

  "theme.toLight": "Switch to light theme",
  "theme.toDark": "Switch to dark theme",
  "locale.switchTo": "Switch language to",

  "devices.title": "Devices",
  "devices.subtitle":
    "Every device registered on the network, with its current reachability.",

  "devices.count": "Showing {shown} of {total} devices",
  "devices.count.one": "Showing {shown} of {total} device",
  "devices.loading": "Loading devices…",
  "devices.loadingList": "Loading devices",

  "devices.column.device": "Device",
  "devices.column.ip": "IP address",
  "devices.column.status": "Status",
  "devices.column.lastPing": "Last ping",
  "devices.column.actions": "Actions",
  "devices.lastPing.now": "Just now",

  "status.All": "All",
  "status.Online": "Online",
  "status.Offline": "Offline",
  "status.Warning": "Warning",

  "filters.search.label": "Search devices by name or IP address",
  "filters.search.placeholder": "Search by name or IP",
  "filters.status.legend": "Filter by status",
  "filters.clear": "Clear filters",
  "filters.copyLink": "Copy link",
  "filters.copyLink.done": "Link copied",

  "devices.add": "Add device",
  "devices.add.title": "Add a device",
  "devices.add.description":
    "Register a device so it shows up in the list straight away.",
  "devices.add.pending": "Adding…",

  "devices.delete": "Delete",
  "devices.delete.label": "Delete {name}",
  "devices.delete.title": "Delete this device?",
  "devices.delete.description":
    "{name} ({ip}) will be removed from the list. This cannot be undone.",
  "devices.delete.confirm": "Delete device",
  "devices.delete.pending": "Deleting…",

  "devices.empty.title": "No devices yet",
  "devices.empty.description":
    "Devices you register will show up here with their latest reachability.",
  "devices.noMatches.title": "No devices match these filters",
  "devices.noMatches.description":
    "Try a different name or IP address, or widen the status filter.",

  "devices.error.title": "Could not load devices",
  "devices.error.description":
    "Something went wrong while reaching the device registry.",
  "devices.error.retry": "Try again",

  "form.name.label": "Device name",
  "form.name.placeholder": "Core-Switch-02",
  "form.ip.label": "IP address",
  "form.ip.placeholder": "192.168.1.2",
  "form.status.label": "Initial status",
  "form.validation.name.required": "Device name is required",
  "form.validation.name.max": "Device name must be 64 characters or fewer",
  "form.validation.ip.required": "IP address is required",
  "form.validation.ip.invalid": "Enter a valid IPv4 address, e.g. 192.168.1.1",

  "common.cancel": "Cancel",
} as const;

export type MessageKey = keyof typeof en;

export type Catalogue = Record<MessageKey, string>;

/**
 * Persian counts one device the same way it counts four, so both plural forms
 * carry the same sentence. Latin fragments left inside — IPv4, IP — are the
 * terms the people using this read on their own equipment.
 */
const fa: Catalogue = {
  "app.name": "مدیریت دستگاه‌ها",
  "app.tagline": "کنسول عملیات شبکه",

  "meta.title": "داشبورد مدیریت دستگاه‌ها",
  "meta.titleTemplate": "%s · مدیریت دستگاه‌ها",
  "meta.description":
    "دستگاه‌های شبکه‌تان را از یک داشبورد ببینید، فیلتر کنید و ثبت کنید.",

  "theme.toLight": "رفتن به پوستهٔ روشن",
  "theme.toDark": "رفتن به پوستهٔ تیره",
  "locale.switchTo": "تغییر زبان به",

  "devices.title": "دستگاه‌ها",
  "devices.subtitle":
    "همهٔ دستگاه‌های ثبت‌شده در شبکه، به‌همراه وضعیت دسترس‌پذیری فعلی‌شان.",

  "devices.count": "نمایش {shown} از {total} دستگاه",
  "devices.count.one": "نمایش {shown} از {total} دستگاه",
  "devices.loading": "در حال بارگذاری دستگاه‌ها…",
  "devices.loadingList": "در حال بارگذاری دستگاه‌ها",

  "devices.column.device": "دستگاه",
  "devices.column.ip": "نشانی IP",
  "devices.column.status": "وضعیت",
  "devices.column.lastPing": "آخرین پینگ",
  "devices.column.actions": "کنش‌ها",
  "devices.lastPing.now": "همین حالا",

  "status.All": "همه",
  "status.Online": "آنلاین",
  "status.Offline": "آفلاین",
  "status.Warning": "هشدار",

  "filters.search.label": "جستجوی دستگاه بر اساس نام یا نشانی IP",
  "filters.search.placeholder": "جستجو بر اساس نام یا IP",
  "filters.status.legend": "فیلتر بر اساس وضعیت",
  "filters.clear": "پاک کردن فیلترها",
  "filters.copyLink": "کپی نشانی",
  "filters.copyLink.done": "نشانی کپی شد",

  "devices.add": "افزودن دستگاه",
  "devices.add.title": "افزودن یک دستگاه",
  "devices.add.description":
    "دستگاه را ثبت کنید تا بی‌درنگ در فهرست نمایش داده شود.",
  "devices.add.pending": "در حال افزودن…",

  "devices.delete": "حذف",
  "devices.delete.label": "حذف {name}",
  "devices.delete.title": "این دستگاه حذف شود؟",
  "devices.delete.description":
    "{name} ({ip}) از فهرست حذف می‌شود. این کار برگشت‌پذیر نیست.",
  "devices.delete.confirm": "حذف دستگاه",
  "devices.delete.pending": "در حال حذف…",

  "devices.empty.title": "هنوز دستگاهی ثبت نشده است",
  "devices.empty.description":
    "هر دستگاهی که ثبت کنید، با آخرین وضعیت دسترس‌پذیری‌اش اینجا نمایش داده می‌شود.",
  "devices.noMatches.title": "هیچ دستگاهی با این فیلترها همخوان نیست",
  "devices.noMatches.description":
    "نام یا نشانی IP دیگری را امتحان کنید، یا فیلتر وضعیت را بازتر بگذارید.",

  "devices.error.title": "بارگذاری دستگاه‌ها ممکن نشد",
  "devices.error.description":
    "هنگام دسترسی به سامانهٔ ثبت دستگاه‌ها مشکلی پیش آمد.",
  "devices.error.retry": "تلاش دوباره",

  "form.name.label": "نام دستگاه",
  "form.name.placeholder": "Core-Switch-02",
  "form.ip.label": "نشانی IP",
  "form.ip.placeholder": "192.168.1.2",
  "form.status.label": "وضعیت اولیه",
  "form.validation.name.required": "نام دستگاه الزامی است",
  "form.validation.name.max": "نام دستگاه باید ۶۴ نویسه یا کمتر باشد",
  "form.validation.ip.required": "نشانی IP الزامی است",
  "form.validation.ip.invalid":
    "یک نشانی IPv4 معتبر وارد کنید، مثل 192.168.1.1",

  "common.cancel": "انصراف",
};

export const CATALOGUES: Record<Locale, Catalogue> = { en, fa };

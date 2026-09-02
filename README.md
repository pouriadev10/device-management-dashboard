# Device Management Dashboard

A single-page dashboard for monitoring network devices: list them, filter them,
share a filtered view as a link, and register or remove devices.

There is no backend. Device data is served from an in-memory mock module with a
small artificial delay, so loading and pending states behave like the real thing.

## Features

- **Device list** — a real table on desktop, stacked cards on mobile, showing
  name, IP address, status and last ping.
- **Search** — matches device name or IP address, debounced by 300ms.
- **Status filter** — All, Online, Offline and Warning.
- **Shareable URLs** — search and status live in the query string, so refreshing
  the page, opening the link in a new tab or sending it to someone else all
  produce the same view. There is a copy-link button to make that obvious.
- **Add a device** — in a modal, validated with Zod. The new device appears in
  the list immediately and the modal closes itself.
- **Delete a device** — with a confirmation step that names the device.
- **Empty states** — one for "nothing registered yet", a different one for
  "nothing matches these filters", the second offering a way to clear them.
- **Skeleton loading** — matched to the real row heights, so nothing shifts when
  the data arrives.

## Tech stack

| Concern       | Choice                             |
| ------------- | ---------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19 |
| Language      | TypeScript, `strict`               |
| Styling       | Tailwind CSS v4                    |
| Data fetching | TanStack Query v5                  |
| Forms         | React Hook Form + Zod              |
| Filter state  | The URL, via `URLSearchParams`     |
| Tests         | Vitest + React Testing Library     |

## Getting started

Requires Node.js 20 or newer.

```bash
pnpm install
```

```bash
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000) and redirects to
`/devices`.

> Using npm or yarn instead? `npm install && npm run dev` works the same way.

## Scripts

| Script            | What it does                |
| ----------------- | --------------------------- |
| `pnpm dev`        | Start the dev server        |
| `pnpm build`      | Production build            |
| `pnpm start`      | Serve the production build  |
| `pnpm test`       | Run the test suite once     |
| `pnpm test:watch` | Run tests in watch mode     |
| `pnpm typecheck`  | Type-check without emitting |
| `pnpm lint`       | Lint with ESLint            |
| `pnpm format`     | Format with Prettier        |

## Tests

```bash
pnpm test
```

75 tests covering the parts worth pinning down: IPv4 validation, filtering,
query-string parsing and serialisation, the debounce, the filter bar, the device
list, the add form and the delete confirmation.

## Project structure

```
src/
├── app/                  # routes and page-level composition
├── components/
│   ├── layout/           # app chrome
│   ├── ui/               # generic primitives: button, input, dialog, …
│   └── devices/          # device-specific components
├── features/devices/     # the domain: schemas, types, mock API, queries, filtering
├── hooks/                # reusable hooks
└── lib/                  # small shared utilities
```

Domain logic lives in `features/devices` and holds no JSX, which keeps the
interesting parts — validation, filtering, URL serialisation — testable without
rendering anything.

## Decisions worth explaining

**The URL is the filter state.** Not a copy of it. There is no `useState` holding
the search term alongside the query string, so the two cannot drift. Filters are
parsed on the server from the page's `searchParams`, which means a shared link
arrives already filtered rather than flashing the full list and correcting
itself a moment later.

Updates go through `history.replaceState` rather than `router.replace`: it keeps
the change on the client, so filtering costs nothing on the server, and it leaves
the history stack alone — eight keystrokes should not cost eight presses of the
back button. Next.js hooks into the native history API, so `useSearchParams`
still re-renders.

Anything unrecognised in the query string falls back to a default instead of
filtering everything away, a status in the wrong case is accepted and
canonicalised, and values that are already the default are left out — so the
cleared state is a plain `/devices`, not `/devices?search=&status=All`.

**A debounced callback, not a debounced value.** A pending write sometimes has to
be abandoned: if the URL changes underneath the input — the back button, or
clearing the filters — the keystroke still waiting to be published is stale and
would undo that change. A debounced value has no way to express that; a callback
with `cancel` does.

**No global state library.** Device data lives in the TanStack Query cache and
filter state lives in the URL. Both are already single sources of truth, and
adding a third store would only give them something to disagree with.

**Types are inferred from the Zod schemas**, so validation and typing cannot
drift apart. The IPv4 check range-checks each octet and rejects leading zeros,
rather than trusting a `\d+\.\d+\.\d+\.\d+` regex that would happily accept
`999.999.999.999`.

**Modals are built on the native `<dialog>` element**, which brings focus
trapping, Escape-to-close, background inertness and top-layer rendering with it
instead of reimplementing them.

# Device Management Dashboard

A single-page dashboard for monitoring network devices: list them, filter them,
and register new ones. Built as a technical assessment.

There is no backend — device data is served from an in-memory mock module with a
small artificial delay, so loading and mutation states behave like the real thing.

## Tech stack

| Concern       | Choice                             |
| ------------- | ---------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19 |
| Language      | TypeScript, `strict` mode          |
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

## Project structure

```
src/
├── app/                  # routes, layouts, and page-level composition
├── components/
│   ├── layout/           # app chrome
│   └── ui/               # generic, feature-agnostic primitives
├── features/devices/     # device domain: schemas, types, mock API, queries
├── hooks/                # reusable hooks
└── lib/                  # small shared utilities
```

Domain logic lives in `features/devices` and is kept free of JSX, which makes the
interesting parts — validation, filtering, URL serialisation — testable without
rendering anything.

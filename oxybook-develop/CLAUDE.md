@AGENTS.md

# oxybook-frontend

Next.js 16 frontend for the Oxybook platform. Uses the App Router, TypeScript, and Tailwind CSS v4. Package manager: **pnpm**.

---

## Architecture — Clean Architecture (frontend adaptation)

Dependencies flow from outer layers inward. The business layer has zero knowledge of React, Next.js, or any infrastructure detail.

```
app  →  presentation  →  business  ←  infra
                               ↑
                            shared
```

### Layer map

```
oxybook-frontend/
├── app/                                  # Next.js App Router — routing only
│   ├── layout.tsx                        # Root layout (fonts, global CSS)
│   └── page.tsx                          # Entry page (thin, delegates to presentation)
│
├── presentation/                         # UI layer
│   ├── external/components/ui/           # Shadcn UI components (Radix-based, do not edit internals)
│   ├── modules/components/               # Feature components, grouped by domain module
│   └── shared/
│       ├── components/layout/            # Layout components reused across modules
│       ├── hooks/                        # Global custom hooks
│       └── utils.ts                      # cn() utility (clsx + tailwind-merge)
│
├── business/
│   └── domains/                          # Domain entities, use cases, validation schemas — no framework deps
│
├── infra/
│   ├── external/http/                    # ky HTTP client setup (base URL, interceptors, auth headers)
│   └── modules/                          # Concrete service/repository implementations used by business layer
│
├── shared/                               # Cross-cutting concerns (constants, pure helpers, global types)
├── assets/                               # Static assets (SVGs, images, fonts)
└── deploy/                               # Deployment configuration (Docker, CI/CD)
```

### Rules

- `app/` pages are thin wrappers — logic lives in `presentation/` or `business/`.
- `business/domains/` must not import from `presentation/`, `infra/`, or any UI/framework library.
- `infra/` implements interfaces defined in `business/`.
- Shadcn components go in `presentation/external/components/ui/` and are never imported directly from `radix-ui` in feature code — always through that wrapper.
- Shared utilities (e.g. `cn`) live in `presentation/shared/utils.ts`.

---

## Libraries

### UI / Styling

| Library | Purpose | Location |
|---|---|---|
| `tailwindcss` v4 | Utility-first CSS framework | Global via `app/globals.css` |
| `tailwind-merge` | Resolves Tailwind class conflicts at runtime | `presentation/shared/utils.ts` (`cn`) |
| `clsx` | Conditional class name composition | `presentation/shared/utils.ts` (`cn`) |
| `class-variance-authority` | Type-safe component variants (`cva`) | `presentation/external/components/ui/` |
| `lucide-react` | Icon library | Anywhere in `presentation/` |
| `next-themes` | Dark/light mode provider | `presentation/shared/components/layout/` |
| `tw-animate-css` | Animation utilities for Tailwind | Global CSS |

### Radix UI primitives (via Shadcn)

All installed under `@radix-ui/react-*`. Used only through wrappers in `presentation/external/components/ui/`:
`avatar`, `checkbox`, `collapsible`, `dialog`, `dropdown-menu`, `label`, `popover`, `select`, `separator`, `slot`, `tooltip`.

### Forms

| Library | Purpose | Location |
|---|---|---|
| `react-hook-form` | Form state management, validation triggers | `presentation/modules/` |
| `@hookform/resolvers` | Connects react-hook-form to zod | `presentation/modules/` |
| `zod` | Schema declaration and validation | `business/domains/` (schemas), `presentation/modules/` (form schemas) |

### Data

| Library | Purpose | Location |
|---|---|---|
| `@tanstack/react-table` | Headless table (sorting, filtering, pagination) | `presentation/modules/` or `presentation/shared/` |
| `date-fns` | Date manipulation and formatting | `shared/` or `business/domains/` |
| `ky` | HTTP client (fetch wrapper) | `infra/external/http/` |
| `cookies-next` | Cookie read/write (client + server) | `infra/` (session/token management) |

### Notifications

| Library | Purpose | Location |
|---|---|---|
| `sonner` | Toast notifications | `presentation/shared/` |

### Next.js

| Library | Purpose |
|---|---|
| `next` 16.2.1 | Framework — App Router, Server Components, Image, Font optimization |
| `react-day-picker` | Date picker UI component |
| `radix-ui` | Meta-package re-exporting all Radix primitives |

---

## `cn()` utility

Located at [presentation/shared/utils.ts](presentation/shared/utils.ts). Use it everywhere class names are composed:

```ts
import { cn } from '@/presentation/shared/utils'

cn('base-class', isActive && 'active', { disabled: isDisabled })
// tailwind conflicts are resolved automatically — last value wins
```

---

## Testing

- Runner: **Vitest** v4 with `jsdom` environment
- Assertions: **@testing-library/react** + **@testing-library/jest-dom**
- Config: [vitest.config.mts](vitest.config.mts) — includes all `**/*.test.{ts,tsx}` files
- Setup: [vitest.setup.ts](vitest.setup.ts) — imports jest-dom matchers

Run tests:

```bash
pnpm test          # watch mode
pnpm test --run    # single run (CI)
```

Test files co-locate with the code they test (e.g. `utils.test.ts` next to `utils.ts`).

---

## Tooling

| Tool | Purpose |
|---|---|
| **Biome** | Formatter (`pnpm format`) — replaces Prettier + ESLint |
| **Husky** | Git hooks |
| **commitlint** | Enforces Conventional Commits on commit messages |
| **TypeScript** strict | Type checking (`pnpm typecheck`) |
| **pnpm** | Package manager |

---

## Scripts

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm start      # Start production server
pnpm test       # Run tests (watch)
pnpm typecheck  # TypeScript type check
pnpm format     # Format with Biome
```

---

## Path alias

`@/*` maps to the project root. Example:

```ts
import { cn } from '@/presentation/shared/utils'
import { userSchema } from '@/business/domains/user'
```

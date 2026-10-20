# HR Enbek — frontend

Public portal and administration of the "Трудовые ресурсы Hr.Enbek" subsystem (stage I).
One Next.js application: public pages under `/{kk|ru|en}`, administration under `/admin`.

## Requirements

- Node.js 24 (`.nvmrc`), pnpm via corepack (`corepack enable`)
- Git 2.9+ for hooks; update to a current Git if possible

## Start

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

`.env.example` points at the cms-service test stand. Without access to it, run `pnpm mock:cms` and set `CMS_SERVICE_URL` and `CMS_PUBLIC_URL` to `http://localhost:8099/cms` (see [ADR 0007](docs/adr/0007-public-cms-content.md)). `CMS_PUBLIC_URL` is read at build time: the Docker image needs it as a build argument.

Open <http://localhost:3000> → redirects to `/kk` (Kazakh is the default language).

## Scripts

| Command                             | What it does                                                                     |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `pnpm dev`                          | Dev server (Turbopack)                                                           |
| `pnpm mock:cms`                     | Public cms-service API from fixtures for development and e2e                     |
| `pnpm build` / `pnpm start`         | Production build / run (`output: standalone`)                                    |
| `pnpm check`                        | All static checks + unit tests + licenses. Run before handing over large changes |
| `pnpm check:commit`                 | `tsc`, Steiger, knip, jscpd, i18n — project-wide checks run by pre-commit        |
| `pnpm check:push`                   | Full ESLint, Stylelint, Prettier, cspell, unit tests, licenses — run by pre-push |
| `pnpm check:ci`                     | `check` + build + bundle size + e2e. Used by CI                                  |
| `pnpm typecheck`                    | Route types generation + `tsc`                                                   |
| `pnpm lint` / `pnpm lint:fix`       | ESLint (zero warnings allowed)                                                   |
| `pnpm lint:css`                     | Stylelint                                                                        |
| `pnpm lint:fsd`                     | Steiger — Feature-Sliced Design rules                                            |
| `pnpm format` / `pnpm format:check` | Prettier (+ Tailwind class order)                                                |
| `pnpm spell`                        | cspell (ru + en + project words)                                                 |
| `pnpm i18n:check`                   | kk and ru dictionaries are complete, en is a subset                              |
| `pnpm unused`                       | knip — unused files, exports, dependencies                                       |
| `pnpm duplicates`                   | jscpd — copy-paste detection                                                     |
| `pnpm test` / `pnpm test:watch`     | Vitest unit and component tests                                                  |
| `pnpm test:e2e`                     | Playwright (desktop + mobile), axe accessibility checks                          |
| `pnpm storybook`                    | Design system in Storybook on port 6006                                          |
| `pnpm size`                         | Client JS budget (size-limit)                                                    |
| `pnpm lighthouse`                   | Lighthouse CI budgets (performance, a11y, SEO)                                   |
| `pnpm licenses:check`               | Allowed licenses only; writes `docs/third-party-licenses.md`                     |

## Git hooks (husky)

| Hook       | Runs                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| pre-commit | lint-staged (ESLint, Prettier, Stylelint, cspell on staged files) + `check:commit` |
| commit-msg | commitlint (Conventional Commits)                                                  |
| pre-push   | `pnpm check:push`                                                                  |

Hooks need Git 2.32+ (lint-staged requirement). `git commit --no-verify` skips them, so CI must run `pnpm check:ci` and block merging on failure.

## Documentation

- [docs/conventions.md](docs/conventions.md) — how code is written here
- [docs/adr](docs/adr) — architecture decisions and their reasons
- [docs/third-party-licenses.md](docs/third-party-licenses.md) — generated list of production dependencies

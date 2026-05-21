# Frontend architecture

High-level layout for `app/`. New code should follow these boundaries.

## Folder map

```
app/
  (routes)/              Next.js pages — thin shells, compose features only
  components/
    shared/              Cross-feature UI (stats, tables, empty, errors, pagination)
    automation/          Automation list, builder, runs
    campaign/            Campaign dashboard panels (overview, orders)
    crm-template-editor/ Funnel / CRM template editor
    builder/             Shared builder chrome
    funnel/              Guest funnel checkout & payment
    payment-templates/   Checkout layout variants
    …                    Other feature folders at this level
  hooks/                 Reusable React hooks (data loading, UI behavior)
  lib/                   Pure utilities, tokens, styles — no React, no fetch
  services/              HTTP/API clients grouped by domain
    automation/
    funnel/
    payment/
    restaurant/
    auth/
  store/                 Redux store (when used)
```

## Import rules

| From | May import |
|------|------------|
| `(routes)/*` | `components/*`, `hooks/*`, `lib/*`, `services/*` |
| `components/<feature>/*` | `components/shared/*`, `hooks/*`, `lib/*`, `services/*`, same feature |
| `components/shared/*` | `lib/*` only |
| `hooks/*` | `lib/*`, `services/*` |
| `lib/*` | other `lib/*` only |
| `services/*` | `lib/*` only |

Do **not**:

- Import one feature’s internals from another feature (e.g. `campaign/` → `automation/builder/`).
- Call `fetch` from components or hooks — use `services/`.
- Duplicate tokens already in `lib/` (badges, dates, motion, panel classes).

## Shared building blocks (`lib/` + `components/shared/`)

| Concern | Location |
|---------|----------|
| Status / trigger / payment badge classes | `lib/badge-variants.ts` |
| Date/time formatting | `lib/datetime.ts` |
| Panel & table surface classes | `lib/panel-styles.ts` |
| List / panel motion presets | `lib/motion.ts` |
| API error messages & toasts | `lib/toast-api-error.ts` |
| Stat cards | `components/shared/MetricStatCard.tsx` |
| Empty states | `components/shared/PanelEmptyState.tsx` |
| Load errors + retry | `components/shared/AsyncErrorRetry.tsx` |
| Report table shell | `components/shared/ReportTable.tsx` |
| Offset pagination | `components/shared/OffsetPagination.tsx` |
| Run automation CTA | `components/shared/RunAutomationButton.tsx` |
| Primary button classes | `lib/panel-styles.ts` (`primaryButtonClass`, `primaryButtonMdClass`) |
| Builder / flow motion | `lib/motion.ts` (`flowListStagger`, `flowStepReveal`, …) |

## Data loading patterns

- **Generic async:** `hooks/use-async-resource.ts` (`data`, `isLoading`, `error`, `refetch`, `setData`).
- **Paginated lists:** `hooks/use-paginated-async-resource.ts` (used by automation runs).
- **Auth token + numeric id:** `hooks/use-token-gated-resource.ts` (funnel stats, payments).
- **Automation executions:** `hooks/use-automation-executions.ts` (wraps paginated resource + delete).
- **Automation / restaurant / campaign lists:** `useAsyncResource` + `services/*`.

## HTTP

- **Automation API:** `services/automation/automation-fetch.ts` (uses `fetchWithTimeout` from `lib/api.ts`).
- **Other domains:** `lib/api.ts`, axios, or domain-specific clients under `services/`.

## Feature docs

- Funnel editor: `docs/funnel-editor.md`
- Restaurant API shapes: `docs/restaurant-api-data.md`

## Adding something new

1. Pick the feature folder under `components/` (or add `shared/` if used in 2+ features).
2. Put API calls in `services/<domain>/`.
3. Reuse `lib/` and `components/shared/` before copying markup or class strings.
4. Keep route files small: load data via hooks, render one feature component.

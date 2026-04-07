Here is a WCAG 2.1 Level AA technical review for `Layout`, `SignIn`, `Register`, and `Toast` (auth flow). This is not a certification; verify contrast and focus in a real browser.

────────────────────────────────────────

WCAG 2.1 AA — Auth layout + Sign in + Register (+ Toast)

Verdict: Pass with notes — Strong form labeling, errors, landmarks, and toast live regions; a few items to verify (contrast/focus) and optional heading/structure polish.

Critical (blocks AA)

None identified from the reviewed markup. Contrast and focus visibility should be confirmed with tooling (see Should fix).

Should fix

• 1.4.3 Contrast (Minimum) — Primary link text uses var(--color-primary) (#00bc77) on white (e.g. .register-link a). Medium green on white often sits near the 4.5:1 line for normal-sized text — measure text and UI components vs
background; adjust color or weight/size if below threshold.

    Files: src/index.css (--color-primary), src/pages/SignIn/styles/SignIn.css (.register-link a).

• 2.4.7 Focus Visible — Focus uses box-shadow: var(--focus-ring) where --focus-ring is 0 0 0 2px rgb(0 188 119 / 25%) (src/index.css). A low-opacity ring can be hard to see on light backgrounds — confirm in Chrome/Firefox that focus
is clearly visible (and meets your internal bar for non-color cue).

    Fix direction: Stronger ring (higher contrast or 2px solid + offset).
    Files: src/index.css, consumers in SignIn.css, Layout.css, Register.css.

Nice to have (AAA or UX)

• 1.3.1 Info and relationships / heading structure — The document exposes an h1 only as .sr-only inside the logo link (Layout.tsx), while the main auth content uses h2 for the page title. That can be valid (site name vs. page), but
some teams prefer a visible h1 for the page title in <main>. Worth aligning with your IA pattern.

    Files: src/components/Layout/Layout.tsx, SignIn.tsx, Register.tsx.

• 2.4.1 Bypass blocks — No skip link to <main>. Not required for a small nav, but helps keyboard-heavy users on larger chrome.

    File: Layout.tsx.

• 3.3.2 Labels or instructions — Register groups four fields without fieldset/legend. Not required for AA if labels are clear; optional grouping for “Account” vs. other sections if the form grows.

Quick wins

• Errors — aria-invalid, aria-describedby, and role="alert" on field/server messages are aligned with 3.3.1 Error identification and 4.1.3 Status messages patterns. (SignIn.tsx, Register.tsx.)
• Landmarks & nav — <nav aria-label="Main navigation">, <main>, <footer> support 1.3.1 / 2.4.1. (Layout.tsx.)
• Decorative icons — Font Awesome icons use aria-hidden="true" where paired with text — 4.1.2 Name, Role, Value. (Layout.tsx.)
• Toast announcements — Container aria-live="polite" / role="status", urgent toasts with role="alert" and aria-live="assertive" — appropriate for dynamic status. (Toast.tsx.)
• Reduced motion — Global @media (prefers-reduced-motion: reduce) shortens transitions — 2.3.3 Animation from interactions (best practice). (index.css.)

────────────────────────────────────────

Assumptions: Audit is limited to the files above; other routes (Home, Profile, etc.) were not fully reviewed. For a complete product pass, extend the same checklist to those pages and run automated checks (axe, Lighthouse) plus a
keyboard-only pass.
If you want a narrower scope (e.g. only Register or only Layout), say which path and the report can be tightened further.

I want you to repport, and create a .md file, no edit will be done

In Ask mode the assistant can’t create or write files in your repo, so the .md file can’t be added from here. Below is the full report as ready-to-save Markdown — you can paste it into something like docs/wcag-audit-auth.md (or any
path you prefer), or switch to Agent mode and ask to create that file.

────────────────────────────────────────

# WCAG 2.1 AA — Technical review (Auth layout + Sign in + Register + Toast)

**Scope:** `Layout`, `SignIn`, `Register`, and `Toast` (auth-related UI).  
 **Standard:** WCAG 2.1 Level **AA** (technical review, not certification).  
 **Date:** 2026-04-06
**Verdict:** Pass with notes — Strong form labeling, errors, landmarks, and toast live regions; verify contrast/focus in browser; optional heading/skip-link polish.

---

## Critical (blocks AA)

None identified from reviewed markup. Contrast and focus visibility should be confirmed with tooling (see Should fix).

---

## Should fix

| Ref                                                                                              | Issue                                                                                                | Fix direction                                                                                | Evidence |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------- |
| **1.4.3** Contrast (Minimum)                                                                     | Primary link text uses brand green (`#00bc77`) on white; may be near the 4.5:1 line for normal text. | Measure with a contrast checker; adjust color, weight, or size if below threshold.           |
| `src/index.css` (`--color-primary`), `src/pages/SignIn/styles/SignIn.css` (`.register-link a`)   |
| **2.4.7** Focus Visible                                                                          | Focus ring uses `rgb(0 188 119 / 25%)` — low-opacity rings can be hard to see on light backgrounds.  | Confirm in Chrome/Firefox; consider a stronger ring (higher contrast or 2px solid + offset). |
| `src/index.css` (`--focus-ring`), styles using `var(--focus-ring)` in SignIn/Layout/Register CSS |

---

## Nice to have (AAA or UX)

- **1.3.1** — `h1` is screen-reader-only in the logo (`Layout`); auth pages use `h2` for the visible page title. Valid pattern; some teams prefer a visible `h1` in `<main>` for the page title.
- **2.4.1** — No skip link to `<main>`; optional for short chrome, helpful for keyboard users as layout grows.
- **3.3.2** — Register has four fields without `fieldset`/`legend`; optional grouping if forms expand.

---

## Quick wins (already aligned)

- **3.3.1 / 4.1.3** — `aria-invalid`, `aria-describedby`, `role="alert"` on errors (`SignIn.tsx`, `Register.tsx`).
- **1.3.1 / 2.4.1** — `<nav aria-label="…">`, `<main>`, `<footer>` (`Layout.tsx`).
- **4.1.2** — Decorative icons `aria-hidden="true"` with visible text (`Layout.tsx`).
- **4.1.3** — Toast: container `aria-live="polite"` / `role="status"`; urgent toasts `role="alert"` + `aria-live="assertive"` (`Toast.tsx`).
- **2.3.3 (best practice)** — `prefers-reduced-motion` shortens transitions (`index.css`).

---

## Files referenced

- `src/components/Layout/Layout.tsx`
- `src/components/Layout/styles/Layout.css`
- `src/pages/SignIn/SignIn.tsx`
- `src/pages/SignIn/styles/SignIn.css`
- `src/pages/Register/Register.tsx`
- `src/pages/Register/styles/Register.css`
- `src/components/Toast/Toast.tsx`
- `src/index.css`

---

## Assumptions

- Other routes (Home, Profile, Settings, etc.) were not fully audited.
- Automated tools (axe, Lighthouse) and a keyboard-only pass are recommended in addition to this review.

  TypeScript / JavaScript / React — code standards (this project)

  TypeScript

  • `strict: true` — use strict typing end to end.
  • Avoid `any` — prefer explicit types or unknown + narrowing.
  • Unused code: noUnusedLocals, noUnusedParameters; ESLint flags unused vars (prefix unused with \_ if intentional).
  • `noUncheckedIndexedAccess` — treat indexed access as possibly undefined; narrow before use.
  • Imports: @/ alias for src/ (see tsconfig.json paths).

  JavaScript / modules

  • ES modules — import / export; avoid CommonJS in app source unless required.
  • ECMAScript — target ES2020+ as in config.

  React

  • React 19 — functional components only.
  • Props: typed interface (e.g. interface Props { ... }) per project convention.
  • Hooks: follow eslint-plugin-react-hooks recommended rules.
  • Fast refresh: react-refresh/only-export-components — avoid exporting non-components from the same file as components (or use the allowed patterns).
  • JSX: react-jsx transform (no import React required for JSX).

  Redux / async data

  • Async logic: createAsyncThunk for Redux async actions (see authThunks.ts).
  • API shapes: wrap responses in something like ApiResponse<T> where applicable.

  Naming & structure

  ┌──────────────┬─────────────────────────────────────────────────────────────────────────────┐
  │ Item │ Convention │
  ├──────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Components │ ComponentName/ComponentName.tsx │
  │ Hooks │ useFeatureName.ts │
  │ Shared types │ src/types/ │
  │ Constants │ SCREAMING_SNAKE_CASE inside grouped objects (e.g. API_ENDPOINTS.AUTH_LOGIN) │
  └──────────────┴─────────────────────────────────────────────────────────────────────────────┘

  Style & formatting

  • Prettier — ~200 char line width (per CLAUDE.md).
  • Comments — minimal; prefer clear names.
  • CSS — Component/styles/Component.css.

  Linting

  • Run `npm run lint:fix` to align with ESLint + Prettier integration.

  ────────────────────────────────────────

  If you wanted a Cursor rule or a `.md` doc in the repo with this content, say so in Agent mode and we can add it under something like .cursor/rules/ or docs/.

  CLAUDE.md improvement report

  Summary

  CLAUDE.md is a short, usable AI-oriented brief: stack, conventions, env vars, and a few commands. It stays clear of README marketing noise. The main issues are one outdated API typing example (ApiResponse<T> vs actual types), incomplete
  command coverage, no deploy/build/test pointers, no safety note for `dev:all`, and a slightly incomplete tree (helpers/, RTK Query usage). No AGENTS.md or .cursor/rules in this repo to dedupe against.

  ────────────────────────────────────────

  Strengths

  • Purpose-first (lines 5–11): AI knows the goal—type safety, consistency, error handling, no any.
  • Concrete patterns (lines 13–20): createAsyncThunk, props interface, constants shape—actionable.
  • Architecture (lines 22–38): Backend/server.js matches the repo (Backend/server.js exists).
  • Env (lines 40–43): Frontend/backend vars named; JWT/database called out.
  • Import alias (line 53): @/ matches tsconfig paths.
  • Prettier line length (line 54): Matches prettier.config.js (printWidth: 200)—accurate, though the config file isn’t referenced.

  ────────────────────────────────────────

  Gaps (severity H/M/L, evidence, fix)

  ┌─────┬───────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Sev │ Issue │ Evidence │ Fix │
  ├─────┼───────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────┤
  │ M │ ApiResponse<T> doesn’t │ CLAUDE L15: “API response: ApiResponse<T>”. src/types/index.ts uses named types (SignInResponse, │ Replace with: point to src/types/index.ts and say “typed response interfaces per endpoint” or │
  │ │ match the codebase │ UserProfileResponse, ApiErrorResponse, etc.); no generic ApiResponse<T>. │ introduce a real generic wrapper if you standardize on one. │
  │ M │ Commands incomplete for │ CLAUDE L45–49 only lists dev, dev:all, lint:fix. package.json also has type-check, lint, format, │ Add 1–2 bullets: “npm run type-check before PR”, “npm run lint / npm run format:check” (or │
  │ │ day-to-day quality │ format:check, lint:styles. │ “see README Development” with link). │
  │ L │ No build/preview/deploy │ Not in CLAUDE. │ One line: npm run build + npm run preview; optional “deploy: see README / hosting” without │
  │ │ │ │ duplicating README. │
  │ L │ Testing not mentioned │ README covers HTTPie, manual flows; CLAUDE silent. │ Single cross-link: “API/manual testing: README § Testing” or Backend/API_TESTING.md. │
  │ L │ Security boundaries │ .env listed but no “don’t commit secrets” / .env.example pointer. │ One line: never commit .env / use local secrets only. │
  │ M │ `dev:all` is destructive │ package.json L8: pkill ... vite ... nodemon. │ Note in CLAUDE: kills other local Vite/nodemon processes—optional one-line warning. │
  │ L │ Architecture tree │ src/helpers/ exists (e.g. validators, server messages); src/mocks/ may exist for MSW. CLAUDE lists api/, │ Add helpers/ (and mocks/ if stable) or say “see src/ for helpers/mocks”. │
  │ │ incomplete │ utils/ but not helpers/. │ │
  └─────┴───────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────┘

  ────────────────────────────────────────

  Redundancy & conflicts

  • README vs CLAUDE: README “Adding Features” (≈L171–177) says src/services/ and src/AppRoutes.tsx—those paths don’t exist in src/; CLAUDE’s api/ + pages/ is closer to reality. CLAUDE should not import README’s wrong paths; optionally add
  a one-line “authoritative paths: src/api/ (RTK Query), src/App.tsx routes” to steer AI away from README drift.
  • No duplicate AGENTS.md or .cursor/rules in repo—nothing to merge.

  ────────────────────────────────────────

  Structure / suggested edits
  1. Order: Keep Purpose → Conventions → Architecture → Environment → Commands → Notes → Boundaries (secrets, dev:all).
  2. Cross-links instead of duplicating README: e.g. “Full install: README.md”; “Testing: README.md § Testing”.
  3. Fix the API line (replace ApiResponse<T> with real pattern + file path).
  4. Optional micro-snippet for Prettier: “prettier.config.js — printWidth: 200” so readers don’t think it’s undocumented.
  5. Mention RTK Query if AI should add endpoints: src/api/ (e.g. argentBankApi.ts)—one phrase avoids inventing a services/ layer.

  ────────────────────────────────────────

  Apply edits: Ask mode is on here; I can’t edit CLAUDE.md. If you switch to Agent mode, say “apply the CLAUDE.md improver recommendations” and specify how minimal vs. expanded you want the file.

  Frontend design audit — full SPA (`frontend-design` skill)

  Routes / surfaces: Home, SignIn, Register, Profile, Settings, Transactions, NotFound — all under Layout + ErrorBoundary. Shared: Layout, Toast, LoadingSpinner, SkeletonLoader, ErrorBoundary, ProtectedRoute (no own styles).
  Verdict: The app is one coherent product via :root tokens (src/index.css) and repeated patterns (dark purple band + mint actions). Marketing (Home) is the only area with hero-level motion and atmosphere. App shells (Profile, Transactions,
  Settings, auth) are utility-first: cards, tables, forms. Against the skill’s bar (“bold aesthetic direction,” distinctive typography, unexpected layout, rich depth), the whole frontend reads as solid fintech UI, not a memorable, editorial,
  or experimental visual system. That is appropriate for banking; it is not what the skill optimizes for.

  ────────────────────────────────────────

  Coverage by area

  ┌─────────────────────────────────────────┬────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Area │ Role │ Design character (vs skill) │
  ├─────────────────────────────────────────┼────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Global (index.css) │ Tokens, focus, prefers-reduced-motion, .sr-only, │ Strong system; typography is Avenir, Helvetica, Arial — skill explicitly discourages generic stacks / Arial. │
  │ │ .btn-primary │ │
  │ Home │ Hero gradient, orb, float/pulse, feature grid, trust │ Strongest match to skill: motion, gradients, card hover. Still centered grid, safe composition. │
  │ │ band │ │
  │ Auth (SignIn + Register + shared │ Centered panel, inputs, primary button │ Clean forms; reuses marketing styling; no distinctive auth-only concept. │
  │ SignIn.css) │ │ │
  │ Layout │ Nav, footer, main (light vs bg-dark for auth) │ Nav “pill” CTAs, hover slide — consistent with brand; standard top bar. │
  │ Profile │ Dark header, stacked account cards │ Dashboard default: white cards, shadow on hover, primary CTA — functional, not expressive. │
  │ Transactions │ Dark header, table, inline edit, back button │ Data UI: uppercase column labels, bordered rows — appropriate; no layout experimentation. │
  │ Settings │ Avatar initial, bordered form card │ Same card + form language as auth; polished, generic pattern. │
  │ NotFound │ not-found wrapper, heading, link │ No `NotFound.css` in repo — relies on globals; likely visually under-designed vs other pages (skill: context-specific character). │
  │ Toast │ Fixed stack, enter/exit animation, Lucide icons │ Enter animation is nice; palette mixes hardcoded neutrals (#fff, #111827, #e5e7eb) with brand-tinted success — partial break from │
  │ │ │ token-only discipline. │
  │ ErrorBoundary │ Centered error card, primary button │ Token-based, clear hierarchy — fine, minimal personality. │
  │ Loaders │ Spinner (brand green), skeleton shimmer │ Functional motion; spinner respects brand color; skeleton is standard pattern. │
  └─────────────────────────────────────────┴────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

  ────────────────────────────────────────

  Cross-app strengths (skill: “cohesive,” “production-grade”)

  • Single token source for most screens: primary, dark, surfaces, borders, errors (index.css).
  • Motion where it matters: Home animations; toast slide; global reduced-motion respect.
  • Focus patterns repeated (--focus-ring, :focus-visible on many controls).
  • Responsive tuning exists on Home, Layout, Profile, SignIn, etc.

  ────────────────────────────────────────

  Cross-app gaps (skill: “distinctive,” “unforgettable,” “avoid generic”)
  1. Typography — One stack app-wide; Arial in fallbacks; no loaded display/body pair or strong typographic hierarchy beyond size/weight.
  2. Two visual gears — Home = marketing polish; rest = dashboard/forms/tables. The skill wants a unified bold direction; you have unified tokens but not unified expressive art direction outside the landing block.
  3. Composition — Mostly centered max-width, symmetric grids, card stacks. Little asymmetry, overlap, or “editorial” layout.
  4. Depth / texture — Hero aside, surfaces are flat grays/whites; limited grain, mesh, or layered atmosphere.
  5. NotFound — Markup only; no scoped styles → weakest fit-and-finish in the app.
  6. Toast — Semantic grays/blues (almost generic UI kit look) next to pages that use CSS variables — small visual dialect split.

  ────────────────────────────────────────

  Summary table (skill pillars × full app)

  ┌──────────────────────────┬─────────────────────────────────────────────────────────────────────────────────┐
  │ Pillar │ Full-app assessment │
  ├──────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
  │ Bold aesthetic direction │ Tokens + fintech green/purple only; no extreme/editorial/brutalist “direction.” │
  │ Typography │ System-forward; skill would push custom faces. │
  │ Color │ Cohesive; familiar neo-bank pairing. │
  │ Motion │ Home + toasts + loaders; no app-wide orchestrated reveals. │
  │ Spatial composition │ Predictable layouts end-to-end. │
  │ Backgrounds / detail │ Hero is the main “designed” layer; elsewhere minimal atmosphere. │
  └──────────────────────────┴─────────────────────────────────────────────────────────────────────────────────┘

  ────────────────────────────────────────

  Bottom line: Across all frontend routes and shared components, the product is consistent, accessible-minded, and professionally bland-in-a-good-way for finance. The `frontend-design` skill targets standout, anti-template interfaces; your
  entire SPA aligns with product consistency, with Home as the only zone that approaches the skill’s motion and atmosphere expectations—and NotFound + Toast as the clearest gaps (unfinished page styling; semi-detached token usage).

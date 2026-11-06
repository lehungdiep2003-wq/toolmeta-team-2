# Toolmeta Landing

React 19, TypeScript, Vite 8 and Tailwind CSS 4 landing website.

## Development and build

Use Node.js 22 (22.12 or later in the 22.x line) and pnpm 10.34.3,
matching `.mise.toml` and `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm dev
```

The output directory is `dist`. Do not commit build output or dependencies.

## Vercel

Create a new private GitHub repository named `Landing-ToolMeta`, branch `main`.
Import it into a **new** Vercel project `landing-toolmeta` in the intended team.
Use root `./`, framework Vite, Node.js 22.x, install command
`pnpm install --frozen-lockfile`, build command `pnpm build`, output `dist`.
Confirm the Git integration production branch is `main`.

Validate a Preview deployment before approving Production. Automatic deployment
from `main` is temporarily disabled in `vercel.json` pending Preview approval.
After approval, remove that branch exception to enable production Git deployments.
Do not attach a custom
domain during this workflow. The SaaS application is separate at
https://app.toolmeta.io.

The build generates physical HTML entrypoints for Pricing, Contact, Terms,
Privacy and the 48 public Guide articles in VI and EN. `vercel.json` restricts
fallbacks to these page routes and Guide; it does not rewrite `/api`, assets,
fonts, or favicon requests to HTML. Vercel checks existing files before rewrites.

## Environment and Contact

No environment variable is required for the static website.
The only optional public client setting is `VITE_CONTACT_API_URL`.
Leave it unset until a real backend is available; the Contact form then shows
that submission is unavailable and never reports fake success. See
`CONTACT_API_HANDOFF.md`. Never put Lark credentials or secrets in `VITE_` values.

`FIGMA_PUBLIC_URL`, if set by the original preview environment, changes the asset
base. Leave it **unset on Vercel** so assets and routes resolve from `/`.
Existing `noindex`/robots settings and legal draft status remain unchanged.

## Content and checks

Homepage, Pricing and Contact support VI/EN/RU/TH/ZH through one language store.
Guide and legal documents support VI/EN with explicit document fallback.

```sh
node scripts/auditI18n.mjs
node scripts/verifyI18n.mjs
node scripts/verifyContact.mjs
node scripts/verifyPricing.mjs
```

Run checks after `pnpm build`. The source-PDF provenance checks in
`verifyGuide.mjs` and `verifyLegal.mjs` additionally require private local audit
files under `dev/guide-review` and `.tmp/legal-original`. Those files and the
original PDF/archive are intentionally excluded from Git and deployment.
Only manifest-approved public Guide content and reviewed image derivatives
are distributed. Do not copy the original internal PDF into `public`.

For UI translation resources, edit `scripts/i18nTranslations.mjs`, run
`node scripts/buildI18n.mjs`, then `node scripts/buildGuideEnglish.mjs`.

Production QA must cover all six routes, a VI/EN Guide article deep link,
refresh, assets, language persistence, CTA targets, mobile widths, and Contact's
unconfigured-backend behavior. HTTP checks alone do not verify visual layout or
browser interaction.

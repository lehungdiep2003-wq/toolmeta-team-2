# Toolmeta deployment handoff

## Verified preparation

- Workspace: `C:\Code\ToolMeta`.
- There was no Git repository, Git remote or Vercel project link before this task.
- Git initialized with branch `main`; no existing history or remote overwritten.
- GitHub repository: https://github.com/dangngocanh00/Landing-ToolMeta (verified private).
- Default branch: `main`; Preview branch: `preview/deployment-qa`.
- Website source commit: `40c047ef0ea6216acc160785da8e84651b753d6f`.
- Initial push verified against the remote `main` SHA; no force push used.
- Vercel project created: `landing-toolmeta`.
- Vercel team: `dangngocanh2004hd-1933s-projects`.
- Vercel project ID: `prj_fr504NdgXejpquXh4hteA613i1a8`.
- Vercel project configured with Node.js 22.x, Vite, frozen pnpm install and `dist`.
- No AezCheck, Trustcard or other existing project changed.
- No custom domain attached.

## Source safety and validation

- Staged source allowlist excludes dependencies, generated output, `.env*`,
  `.vercel`, local tools, private guide provenance and original PDF/archive.
- Initial credential-signature scan found no matching secrets in staged files.
  This is a pattern scan, not a guarantee against every kind of sensitive data.
- Source/public media totals approximately 6.7 MB; Git LFS rules removed before
  the initial commit so standard Git stores the actual assets.
- `pnpm@10.34.3 install --frozen-lockfile` passed in an isolated validation folder.
- Clean source build passed with Node.js 22 and pnpm 10.34.3.
- TypeScript check on the clean source passed.
- Source-only validation does not include private original-document audits;
  those remain available only in the original local workspace.

## Environment and release controls

- No environment variable is required for the static site.
- `VITE_CONTACT_API_URL` remains unset: Contact cannot submit until the backend
  team configures a real endpoint. No Lark credentials or fake success introduced.
- Vercel CLI may create `.env.local` during linking; it is excluded from Git and
  deployment. Never copy its contents into repository documentation.
- `FIGMA_PUBLIC_URL` must remain unset on Vercel.
- Existing noindex/robots and legal draft status unchanged.
- Automatic deployments from `main` are temporarily disabled in `vercel.json`.
  Production requires explicit approval of a validated Preview first.

## Verified Preview

- Git Integration is connected to this repository; production branch `main`.
- Preview: https://landing-toolmeta-5kro61dah-dangngocanh2004hd-1933s-projects.vercel.app
- Deployment: `dpl_5AQ1uB64K1rniqJWTpnrLDLsXA2i`, READY, API target `staging` (Preview).
- Vercel cloned `preview/deployment-qa` at source commit `40c047e`.
- Vercel build logs confirm frozen pnpm 10.34.3 install and successful Vite build.
- Initial CLI attempts were automatically promoted to Production despite Preview
  flags. Those deployments were removed. The final deployment list contains only
  the READY Preview; Production approval is still pending.
- The user explicitly approved public Preview access. Vercel Authentication was
  disabled only for project `landing-toolmeta` (`ssoProtection: null`).
  Unauthenticated HTTP access to the Preview was verified (200).
  Repository visibility remains private; Production approval is still pending.

Authenticated HTTP checks passed for `/`, `/pricing`, `/guide`, `/guide/en`,
`/contact`, `/terms`, `/privacy`, the English installation article deep link,
and `/favicon.svg` (200). `/api/contact` and a missing `/assets` file returned
404, confirming these paths are not rewritten to the SPA shell.

Local automated checks passed: TypeScript, clean-source build, i18n matrix,
Guide public-content audit, Contact validation/payload/error behavior, Pricing
content and CTA/navigation. Contact has no real backend endpoint configured;
no real customer request was submitted and no fake success was added.

Browser visual and interactive QA remains unverified: Header/Footer dropdown
interaction, five-language layouts, animation, runtime console, typography,
and desktop/tablet/mobile screenshots. HTTP checks do not establish these results.

## Release approval

Review the Preview before authorizing Production. Do not attach a custom domain
without separate domain confirmation. After approval, enable production Git
deployments by removing the temporary `main: false` exception and use a validated
production deployment/promotion workflow.

Reference: https://vercel.com/docs/project-configuration/git-configuration

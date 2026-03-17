# 02 — Remove Next.js dependency, ship as pure React package

**Type:** Enhancement
**Status:** Open
**Created:** 2026-03-17

## Problem

The library (`components/shorms/`, `lib/`, `types/`, `index.ts`) has zero
Next.js imports, but `package.json` bundles Next.js and demo-only deps
(`next`, `next-themes`, `react-markdown`, `geist`, `shiki`) as
`dependencies`. Consumers installing shorms pull in Next.js unnecessarily.

## Proposed Changes

1. **Split repo structure** — separate library code from demo app
   (e.g. `examples/nextjs/` or a separate repo for the demo)
2. **Clean up dependencies** — move `next`, `next-themes`,
   `react-markdown`, `geist`, `shiki` out of library deps
3. **Add peerDependencies** — `react`, `react-dom`, `react-hook-form`,
   `zod` should be peers
4. **Add tsup build** — already in devDeps, just needs config
5. **Update package.json entry points** — `main`, `module`, `types`
   pointing to built output

## Notes

- Library code is already framework-agnostic — this is purely a
  packaging change.
- Next.js imports exist only in: `app/`, `components/form-app.tsx`,
  `components/markdown-page.tsx`, `components/mode-toggle.tsx`,
  `lib/fonts.ts`.

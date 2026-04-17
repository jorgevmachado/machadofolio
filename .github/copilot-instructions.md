# Copilot Instructions for machadofolio Monorepo

## Big Picture Architecture
- This is a Turborepo monorepo with multiple apps (`apps/`) and packages (`packages/`).
- Major apps: `apps/nest-js` (NestJS backend, CommonJS), `apps/web` and `apps/finance` (Next.js/React, ESM).
- Shared libraries live in `packages/` (e.g. `business`, `services`, `ds`, `ui`).
- Libraries are consumed by both backend and frontend, so builds must support both CJS and ESM outputs.
- Each package has its own `tsconfig.json`, `package.json`, and often a `rollup.config.js` for dual module output.

## Developer Workflows
- **Build:** Use `yarn build` in each package to generate both CJS and ESM outputs. Example: `yarn workspace @repo/business build`.
- **TypeScript:** Type declarations are generated to `dist/` via `tsc --project tsconfig.json`.
- **Lint:** Run `yarn lint` in any package or app for code style checks.
- **Test:** Use `yarn test` or `yarn test:watch` for Jest-based tests. Coverage: `yarn test:ci`.
- **NestJS:** Start dev server with `yarn start:dev` in `apps/nest-js`.
- **Next.js:** Start frontend with `yarn dev` in `apps/web` or `apps/finance`.
- **Rollup:** Used for bundling libraries; entry is usually `src/index.ts`, outputs to `dist/index.js` (CJS) and `dist/index.esm.js` (ESM).

## Project-Specific Conventions
- **Exports:** All shared code is exported from each package's `src/index.ts`. Only files referenced here are bundled.
- **TypeScript Paths:** Use `tsconfig.json` `paths` for local package resolution. Example: `@repo/business` maps to `../../packages/business/dist` in apps.
- **Dual Module Support:** Libraries must build both CJS and ESM for compatibility with NestJS and Next.js. See `rollup.config.js` and `package.json` `exports` field.
- **No implicit JS output:** If a file only exports types, TypeScript will not emit a `.js` file—ensure at least one `const`/`function` is exported for runtime modules.
- **ESLint Config:** Centralized in `packages/eslint-config`. Follow instructions in its README for usage.

## Integration Points & Patterns
- **Cross-package imports:** Always import from the built `dist/` output, not directly from `src/`.
- **External dependencies:** Managed via workspace `package.json` and individual package manifests.
- **Circular dependencies:** Watch for and resolve circular imports, especially in finance-related modules.
- **Build order:** If a package depends on another, build dependencies first (or use Turborepo to orchestrate).

## Key Files & Directories
- `apps/nest-js/tsconfig.json` – TypeScript config for backend, with path mapping for shared libs.
- `packages/business/rollup.config.js` – Example of dual CJS/ESM build config.
- `packages/business/package.json` – Shows `exports` field for module resolution.
- `packages/eslint-config/README.md` – ESLint usage and setup.
- `README.md` (root) – Main project setup and environment instructions.

---

For unclear or incomplete sections, please provide feedback or specify which workflows or conventions need more detail.

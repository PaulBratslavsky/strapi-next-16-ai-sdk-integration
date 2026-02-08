# Blog Post: yarn → npm Command Changes

All `yarn` commands in the blog post need to be replaced with `npm` equivalents.

## Add this note after "make sure to use Node 22" in Part 1

> **Note:** This tutorial uses `npm` for all commands. If you prefer **yarn** or **pnpm**, the commands are interchangeable (e.g., `npm run dev` → `yarn dev`, `npm install` → `yarn add`).

## Command replacements

| Location | Current (yarn) | Replace with (npm) |
|----------|---------------|-------------------|
| Step 1.4 | `yarn dev` | `npm run dev` |
| Step 2.1 (build plugin) | `yarn build` | `npm run build` |
| Step 2.1 (watch mode) | `yarn watch` | `npm run watch` |
| Step 2.1 (restart strapi) | `yarn dev` | `npm run dev` |
| Step 2.2 (install AI deps) | `yarn add @ai-sdk/anthropic ai` | `npm install @ai-sdk/anthropic ai` |
| Step 2.8 (rebuild) | `yarn build` | `npm run build` |
| Step 2.8 (develop) | `yarn develop` | `npm run develop` |
| Step 2.14 (run test) | `yarn test:ask` | `npm run test:ask` |

## Summary

- `yarn dev` → `npm run dev`
- `yarn build` → `npm run build`
- `yarn develop` → `npm run develop`
- `yarn watch` → `npm run watch`
- `yarn add <pkg>` → `npm install <pkg>`
- `yarn test:ask` → `npm run test:ask`

## Note

The troubleshooting callout in Step 2.1 already mentions `npm install --legacy-peer-deps` as the primary fix, with yarn/pnpm as alternatives - that section is fine as-is.

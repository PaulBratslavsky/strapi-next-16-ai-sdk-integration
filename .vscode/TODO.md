# TODO: Mention to Strapi Engineers

## @strapi/sdk-plugin init hardcodes npm install

The `npx @strapi/sdk-plugin@latest init` command hardcodes `npm install` as its final step. There is no option to skip it or choose a different package manager (yarn, pnpm).

### Why this is a problem

- Many Strapi users (including internally at Strapi) use Yarn.
- The scaffolded plugin template has a peer dependency conflict (`react-intl@^8.1.3` requires React 19, but the template sets `react@^18.3.1`), which causes `npm install` to fail with `ERESOLVE`.
- Even without the peer dep issue, running `npm install` in a Yarn-managed project creates a conflicting `package-lock.json` and `node_modules` that can cause issues.

### Suggested fixes

1. **Detect the package manager** from the parent project (check for `yarn.lock`, `pnpm-lock.yaml`, or `package-lock.json`) and use the matching installer.
2. **Add a `--skip-install` flag** so users can install dependencies themselves with their preferred package manager.
3. **Fix the peer dependency conflict** in the plugin template by aligning React versions.

# t/ playground

**A small light for every season.** Interactive 3D experiments for the web, built with Three.js and React Three Fiber. A new one switches on with each holiday.

🌐 **[playground.oksana.dev](https://playground.oksana.dev)**

## Experiments

<table>
  <tr>
    <th></th>
    <th align="left">Experiment</th>
    <th align="left">Season</th>
    <th align="left">Status</th>
  </tr>
  <tr>
    <td>
      <a href="https://playground.oksana.dev/halloween">
        <img src="apps/halloween/docs/preview.gif" width="180" alt="Glowkin: carving a pumpkin and lighting it up" />
      </a>
    </td>
    <td>
      <strong><a href="apps/halloween">Glowkin</a></strong><br />
      Carve a pumpkin in 3D and watch it light up the dark.
    </td>
    <td>Halloween 2026</td>
    <td>WIP · <a href="https://playground.oksana.dev/halloween"><strong>Play →</strong></a></td>
  </tr>
  <tr>
    <td align="center">❄️</td>
    <td><strong>Christmas experiment</strong><br />Coming in December.</td>
    <td>Christmas 2026</td>
    <td>Coming soon</td>
  </tr>
  <tr>
    <td align="center">🎆</td>
    <td><strong>New Year experiment</strong><br />Coming at the end of December.</td>
    <td>New Year 2027</td>
    <td>Coming soon</td>
  </tr>
</table>

Season one: Halloween 2026 → Christmas → New Year 2027

## Repository

A pnpm + [Turborepo](https://turborepo.dev) monorepo. Every experiment is its own Next.js app and its own Vercel project; the hub stitches them together under one domain.

```
apps/
  hub/          playground, the catalog (proxies /halloween to its app)
  halloween/    Glowkin, served under basePath /halloween
packages/
  shared/       design tokens, the "← playground" overlay, the experiments registry
```

## Run locally

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev          # hub on :3000, halloween on :3001
```

- Hub: <http://localhost:3000>
- Glowkin: <http://localhost:3001/halloween> (also reachable through the hub at <http://localhost:3000/halloween>)

```bash
pnpm lint
pnpm test
pnpm build
```

## Adding an experiment

1. Create `apps/<name>` (a Next.js app) with `basePath: '/<name>'`, and render `<Overlay />` from `@playground/shared/Overlay` in its root layout. Set `--accent` to the season color.
2. Add an entry to `EXPERIMENTS` in [`packages/shared/src/experiments.ts`](packages/shared/src/experiments.ts). The hub timeline and cards are built from it.
3. Add the rewrite for `/<name>` in [`apps/hub/next.config.ts`](apps/hub/next.config.ts) and a `<NAME>_URL` environment variable (declare it in `turbo.json` too, since Turborepo hides undeclared variables from builds).
4. Create a Vercel project with Root Directory `apps/<name>`, and add a row to the table above.

---

Made by [toksana](https://oksana.dev) · [@toksana_dev](https://x.com/toksana_dev)

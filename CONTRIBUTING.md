# Contributing

## Prerequisites

- [Node.js](https://nodejs.org) `>=24.0.0`
- [pnpm](https://pnpm.io) `>=10.0.0`

## Setup

```sh
git clone https://github.com/illiakovalenko/kovforge.git
cd kovforge
pnpm install
```

## Development

```sh
pnpm build       # build all packages
pnpm dev         # watch mode for all packages
pnpm check       # format + lint (Biome)
```

To work on a specific package:

```sh
cd packages/content-devtools-next
pnpm dev
```

## Submitting changes

1. Fork the repo and create a branch from `main`
2. Make your changes
3. Run `pnpm check` to ensure formatting and linting pass
4. Run `pnpm build` to ensure everything builds
5. Add a changeset describing your change:
   ```sh
   pnpm changeset
   ```
6. Open a pull request

## Changesets

Every pull request that affects a published package needs a changeset. Running `pnpm changeset` will prompt you to select which packages changed and whether the bump is `patch`, `minor`, or `major`.

If your change is internal only (docs, config, tooling) and doesn't affect published packages, you can skip the changeset.

## License

By contributing you agree that your contributions will be licensed under the [MIT License](./LICENSE).

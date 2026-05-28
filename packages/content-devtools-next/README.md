# @kovforge/content-devtools-next

![kovforge](https://raw.githubusercontent.com/illiakovalenko/kovforge/main/assets/banner.svg)

Developer tooling for [Sitecore Content SDK](https://github.com/Sitecore/content-sdk) Next.js applications.

## Features

- **`<ContentDevTools />`** - floating panel to inspect page context, layout tree, component fields, and rendering mode at runtime
- **`useDevtoolsData`** - hook exposing structured page and layout data for building custom dev tooling
- Renders only in `development` - zero impact on production builds

## Installation

```sh
npm install -D @kovforge/content-devtools-next
# or
pnpm add -D @kovforge/content-devtools-next
```

## Usage

### Devtools panel

Add `<ContentDevTools />` anywhere inside `<SitecoreProvider>`. Safe to leave in your providers file — it only renders when `NODE_ENV === 'development'`:

```tsx
// app/providers.tsx
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { ContentDevTools } from '@kovforge/content-devtools-next';

export function Providers({ children }) {
  return (
    <SitecoreProvider ...>
      {children}
      <ContentDevTools />
    </SitecoreProvider>
  );
}
```

A floating **SC** button appears at the bottom-right of your page. Click it to open the panel.

**Page tab** - site name, language, item path, route name, and current rendering mode (Normal / Editing / Preview / Design Library).

**Layout tab** - full component tree with placeholders, datasources, fields, and params.

### `useDevtoolsData`

Access the raw data to build your own dev tools:

```tsx
import { useDevtoolsData } from "@kovforge/content-devtools-next";

function MyPanel() {
  const data = useDevtoolsData();
  if (!data) return null;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

### `DevtoolsData`

| Field              | Type               | Description                    |
| ------------------ | ------------------ | ------------------------------ |
| `siteName`         | `string`           | Active site name               |
| `language`         | `string`           | Current language               |
| `itemPath`         | `string`           | Sitecore item path             |
| `routeName`        | `string`           | Route name                     |
| `routeDisplayName` | `string`           | Route display name             |
| `isEditing`        | `boolean`          | Experience Editor / Pages mode |
| `isPreview`        | `boolean`          | Preview mode                   |
| `isDesignLibrary`  | `boolean`          | Design Library mode            |
| `isNormal`         | `boolean`          | Normal rendering mode          |
| `placeholders`     | `DevPlaceholder[]` | Full layout tree               |

## Requirements

- Node.js `>=24.0.0`
- React `>=18`
- `@sitecore-content-sdk/react` `>=2.0.0`
- Next.js with App Router

## License

MIT © [Illia Kovalenko](https://github.com/illiakovalenko)

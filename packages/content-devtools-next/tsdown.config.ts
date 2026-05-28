import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  deps: {
    neverBundle: ['react', 'react-dom', '@sitecore-content-sdk/react'],
  },
  // Preserve 'use client' directive so Next.js app router treats all exports as client code.
  // Every export in this package uses React hooks and is inherently client-side.
  banner: {
    js: '"use client";',
  },
});

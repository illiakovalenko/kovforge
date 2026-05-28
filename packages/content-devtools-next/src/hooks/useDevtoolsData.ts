import { type ComponentRendering, type RouteData, useSitecore } from '@sitecore-content-sdk/react';

type PlaceholdersData = RouteData['placeholders'];

export type DevField = {
  name: string;
  value: unknown;
};

export type DevComponent = {
  uid: string;
  componentName: string;
  dataSource: string;
  fields: DevField[];
  params: Record<string, string>;
  nestedPlaceholders: DevPlaceholder[];
};

export type DevPlaceholder = {
  key: string;
  components: DevComponent[];
};

export type DevtoolsData = {
  siteName: string;
  language: string;
  itemPath: string;
  isEditing: boolean;
  isDesignLibrary: boolean;
  isNormal: boolean;
  isPreview: boolean;
  routeName: string;
  routeDisplayName: string;
  placeholders: DevPlaceholder[];
};

function buildFields(fields: ComponentRendering['fields']): DevField[] {
  if (!fields) return [];
  return Object.entries(fields).map(([name, field]) => ({
    name,
    value: (field as { value?: unknown })?.value ?? field,
  }));
}

function buildPlaceholders(data: PlaceholdersData): DevPlaceholder[] {
  return Object.entries(data).map(([key, renderings]) => ({
    key,
    components: renderings.map((r) => ({
      uid: r.uid ?? '',
      componentName: r.componentName,
      dataSource: r.dataSource ?? '',
      fields: buildFields(r.fields),
      params: (r.params ?? {}) as Record<string, string>,
      nestedPlaceholders: r.placeholders ? buildPlaceholders(r.placeholders) : [],
    })),
  }));
}

export function useDevtoolsData(): DevtoolsData | null {
  const { page } = useSitecore();
  if (!page) return null;

  const { layout, mode, locale, siteName } = page;
  const { context, route } = layout.sitecore;

  return {
    siteName: siteName ?? context.site?.name ?? 'unknown',
    language: context.language ?? locale,
    itemPath: context.itemPath ?? '/',
    isEditing: mode.isEditing,
    isDesignLibrary: mode.isDesignLibrary,
    isNormal: mode.isNormal,
    isPreview: mode.isPreview,
    routeName: route?.name ?? '',
    routeDisplayName: route?.displayName ?? '',
    placeholders: route?.placeholders ? buildPlaceholders(route.placeholders) : [],
  };
}

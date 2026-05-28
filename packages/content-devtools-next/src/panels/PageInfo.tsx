'use client';
import type { ReactElement } from 'react';
import type { DevtoolsData } from '../hooks/useDevtoolsData';

type Props = { data: DevtoolsData };

type ModeFlag = 'isEditing' | 'isDesignLibrary' | 'isNormal' | 'isPreview';
const MODE_FLAGS: ModeFlag[] = ['isEditing', 'isDesignLibrary', 'isNormal', 'isPreview'];

export function PageInfo({ data }: Props): ReactElement {
  const activeModeFlag = MODE_FLAGS.find((m) => data[m]);
  const modeLabel = activeModeFlag ? activeModeFlag.replace('is', '') : 'Unknown';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Row label="Site" value={data.siteName} />
      <Row label="Language" value={data.language} />
      <Row label="Path" value={data.itemPath} />
      <Row label="Route" value={data.routeDisplayName || data.routeName || '—'} />
      <Row label="Mode" value={modeLabel} highlight />
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '6px 0',
        borderBottom: '1px solid #2a2a2a',
        alignItems: 'baseline',
      }}
    >
      <span style={{ color: '#858585', minWidth: 72, fontSize: 12 }}>{label}</span>
      <span style={{ color: highlight ? '#4ec9b0' : '#d4d4d4', wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  );
}

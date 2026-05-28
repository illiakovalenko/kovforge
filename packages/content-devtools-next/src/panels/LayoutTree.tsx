'use client';
import { type ReactElement, useState } from 'react';
import type {
  DevComponent,
  DevField,
  DevPlaceholder,
  DevtoolsData,
} from '../hooks/useDevtoolsData';

type Props = { data: DevtoolsData };

export function LayoutTree({ data }: Props): ReactElement {
  if (data.placeholders.length === 0) {
    return (
      <div style={{ color: '#858585', fontStyle: 'italic', padding: '8px 0' }}>
        No layout data available.
      </div>
    );
  }

  return (
    <div>
      <div style={{ color: '#858585', marginBottom: 10, fontSize: 11 }}>
        route <span style={{ color: '#d7ba7d' }}>{data.routeDisplayName || data.routeName}</span>
      </div>
      {data.placeholders.map((p) => (
        <PlaceholderNode key={p.key} placeholder={p} />
      ))}
    </div>
  );
}

function PlaceholderNode({ placeholder }: { placeholder: DevPlaceholder }): ReactElement {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{ marginBottom: 4 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          padding: '3px 0',
          userSelect: 'none',
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        <Chevron expanded={expanded} color="#c586c0" />
        <span style={{ color: '#c586c0' }}>placeholder</span>
        <span style={{ color: '#d7ba7d' }}>{placeholder.key}</span>
        <span style={{ color: '#555', fontSize: 11 }}>({placeholder.components.length})</span>
      </div>
      {expanded && (
        <div style={{ marginLeft: 16 }}>
          {placeholder.components.length === 0 ? (
            <div style={{ color: '#555', fontSize: 11, padding: '2px 0', fontStyle: 'italic' }}>
              empty
            </div>
          ) : (
            placeholder.components.map((c, i) => (
              <ComponentNode key={c.uid || `${placeholder.key}_${i}`} component={c} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ComponentNode({ component }: { component: DevComponent }): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const hasFields = component.fields.length > 0;
  const hasNested = component.nestedPlaceholders.length > 0;
  const hasChildren = hasFields || hasNested;

  return (
    <div style={{ marginBottom: 2 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: hasChildren ? 'pointer' : 'default',
          padding: '3px 0',
          userSelect: 'none',
        }}
        onClick={() => hasChildren && setExpanded((e) => !e)}
      >
        {hasChildren ? (
          <Chevron expanded={expanded} color="#569cd6" />
        ) : (
          <span style={{ color: '#3c3c3c', fontSize: 10, width: 10 }}>·</span>
        )}
        <span style={{ color: '#4ec9b0' }}>{component.componentName}</span>
        {component.dataSource && (
          <span style={{ color: '#6a9955', fontSize: 11 }}>[{component.dataSource}]</span>
        )}
        {component.uid && (
          <span style={{ color: '#555', fontSize: 10 }}>#{component.uid.slice(0, 8)}</span>
        )}
      </div>

      {expanded && (
        <div style={{ marginLeft: 20 }}>
          {hasFields && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  padding: '2px 0',
                  userSelect: 'none',
                }}
                onClick={() => setFieldsOpen((o) => !o)}
              >
                <Chevron expanded={fieldsOpen} color="#ce9178" />
                <span style={{ color: '#ce9178' }}>fields</span>
                <span style={{ color: '#555', fontSize: 11 }}>({component.fields.length})</span>
              </div>
              {fieldsOpen && (
                <div style={{ marginLeft: 16 }}>
                  {component.fields.map((f) => (
                    <FieldRow key={f.name} field={f} />
                  ))}
                </div>
              )}
            </div>
          )}
          {hasNested &&
            component.nestedPlaceholders.map((p) => (
              <PlaceholderNode key={p.key} placeholder={p} />
            ))}
        </div>
      )}
    </div>
  );
}

function FieldRow({ field }: { field: DevField }): ReactElement {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '3px 0', alignItems: 'flex-start' }}>
      <span style={{ color: '#9cdcfe', minWidth: 110, flexShrink: 0, fontSize: 12, paddingTop: 1 }}>
        {field.name}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <FieldValue value={field.value} depth={0} />
      </div>
    </div>
  );
}

// --- Field value renderers ---

function FieldValue({ value, depth = 0 }: { value: unknown; depth?: number }): ReactElement {
  if (value === null || value === undefined) {
    return <span style={{ color: '#569cd6', fontSize: 12 }}>null</span>;
  }
  if (typeof value === 'string') {
    return <StringValue value={value} />;
  }
  if (typeof value === 'number') {
    return <span style={{ color: '#b5cea8', fontSize: 12 }}>{value}</span>;
  }
  if (typeof value === 'boolean') {
    return <span style={{ color: '#569cd6', fontSize: 12 }}>{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    return <ArrayValue items={value} depth={depth} />;
  }
  if (typeof value === 'object') {
    return <ObjectValue obj={value as Record<string, unknown>} depth={depth} />;
  }
  return <span style={{ color: '#ce9178', fontSize: 12 }}>{String(value)}</span>;
}

function StringValue({ value }: { value: string }): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const isLong = value.length > 80;
  const display = isLong && !expanded ? `${value.slice(0, 80)}…` : value;

  return (
    <span style={{ color: '#ce9178', wordBreak: 'break-all', fontSize: 12 }}>
      &ldquo;{display}&rdquo;
      {isLong && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((o) => !o);
          }}
          style={{
            marginLeft: 6,
            color: '#0e639c',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 10,
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          {expanded ? 'less' : 'more'}
        </button>
      )}
    </span>
  );
}

function ObjectValue({
  obj,
  depth,
}: {
  obj: Record<string, unknown>;
  depth: number;
}): ReactElement {
  const [expanded, setExpanded] = useState(depth === 0);
  const entries = Object.entries(obj).filter(([, v]) => v !== undefined);

  if (entries.length === 0) {
    return <span style={{ color: '#858585', fontSize: 12 }}>{'{}'}</span>;
  }

  const summary =
    entries
      .slice(0, 3)
      .map(([k]) => k)
      .join(', ') + (entries.length > 3 ? ', …' : '');

  return (
    <div>
      <span
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((o) => !o);
        }}
      >
        <Chevron expanded={expanded} color="#858585" />
        <span style={{ color: '#858585', fontSize: 12 }}>{expanded ? '{' : `{ ${summary} }`}</span>
      </span>
      {expanded && (
        <div style={{ marginLeft: 12 }}>
          {entries.map(([key, val]) => (
            <div
              key={key}
              style={{ display: 'flex', gap: 6, padding: '1px 0', alignItems: 'flex-start' }}
            >
              <span
                style={{
                  color: '#9cdcfe',
                  minWidth: 80,
                  flexShrink: 0,
                  fontSize: 11,
                  paddingTop: 1,
                }}
              >
                {key}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <FieldValue value={val} depth={depth + 1} />
              </div>
            </div>
          ))}
          <span style={{ color: '#858585', fontSize: 12 }}>{'}'}</span>
        </div>
      )}
    </div>
  );
}

function ArrayValue({ items, depth }: { items: unknown[]; depth: number }): ReactElement {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) {
    return <span style={{ color: '#858585', fontSize: 12 }}>{'[ ]'}</span>;
  }

  return (
    <div>
      <span
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded((o) => !o);
        }}
      >
        <Chevron expanded={expanded} color="#858585" />
        <span style={{ color: '#858585', fontSize: 12 }}>
          {expanded ? `[ ${items.length} ]` : `[ ${items.length} items ]`}
        </span>
      </span>
      {expanded && (
        <div style={{ marginLeft: 12 }}>
          {items.map((item, i) => (
            <div
              key={i}
              style={{ display: 'flex', gap: 6, padding: '1px 0', alignItems: 'flex-start' }}
            >
              <span
                style={{
                  color: '#858585',
                  minWidth: 24,
                  flexShrink: 0,
                  fontSize: 11,
                  paddingTop: 1,
                }}
              >
                [{i}]
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <FieldValue value={item} depth={depth + 1} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ expanded, color }: { expanded: boolean; color: string }): ReactElement {
  return (
    <span style={{ color, fontSize: 9, width: 10, display: 'inline-block', textAlign: 'center' }}>
      {expanded ? '▼' : '▶'}
    </span>
  );
}

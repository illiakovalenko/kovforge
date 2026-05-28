'use client';
import { type CSSProperties, type ReactElement, useState } from 'react';
import { useDevtoolsData } from './hooks/useDevtoolsData';
import { LayoutTree } from './panels/LayoutTree';
import { PageInfo } from './panels/PageInfo';

type Tab = 'page' | 'layout';

const styles = {
  toggleButton: {
    position: 'fixed' as const,
    bottom: 20,
    right: 20,
    zIndex: 999999,
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#0e639c',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 11,
    fontWeight: 700 as const,
    fontFamily: 'monospace',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.5px',
  },
  panel: {
    position: 'fixed' as const,
    bottom: 70,
    right: 20,
    zIndex: 999999,
    width: 460,
    maxHeight: 560,
    borderRadius: 8,
    background: '#1e1e1e',
    border: '1px solid #3c3c3c',
    boxShadow: '0 4px 24px rgba(0,0,0,0.7)',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: "'Consolas', 'Menlo', monospace",
    fontSize: 13,
    color: '#d4d4d4',
    overflow: 'hidden',
  },
  header: {
    padding: '10px 14px',
    background: '#252526',
    borderBottom: '1px solid #3c3c3c',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 600 as const,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#858585',
    cursor: 'pointer',
    fontSize: 18,
    lineHeight: 1,
    padding: '0 2px',
  },
  tabBar: {
    display: 'flex',
    background: '#252526',
    borderBottom: '1px solid #3c3c3c',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: 14,
  },
} as const;

function tabButtonStyle(active: boolean): CSSProperties {
  return {
    padding: '8px 16px',
    background: 'transparent',
    color: active ? '#fff' : '#858585',
    border: 'none',
    borderBottom: active ? '2px solid #0e639c' : '2px solid transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: 12,
    fontWeight: active ? 600 : 400,
  };
}

function DevtoolsInner(): ReactElement | null {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('page');
  const data = useDevtoolsData();

  if (!data) return null;

  return (
    <>
      <button
        type="button"
        style={styles.toggleButton}
        title="KovForge DevTools"
        onClick={() => setOpen((o) => !o)}
      >
        SC
      </button>

      {open && (
        <div style={styles.panel}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>
              <span style={{ color: '#0e639c' }}>◆</span>
              KovForge DevTools
            </span>
            <button type="button" style={styles.closeButton} onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div style={styles.tabBar}>
            <button
              type="button"
              style={tabButtonStyle(activeTab === 'page')}
              onClick={() => setActiveTab('page')}
            >
              Page
            </button>
            <button
              type="button"
              style={tabButtonStyle(activeTab === 'layout')}
              onClick={() => setActiveTab('layout')}
            >
              Layout
            </button>
          </div>

          <div style={styles.content}>
            {activeTab === 'page' && <PageInfo data={data} />}
            {activeTab === 'layout' && <LayoutTree data={data} />}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Floating developer tools panel for Sitecore Content SDK.
 * Renders only in development mode (NODE_ENV === 'development').
 * Must be placed inside <SitecoreProvider>.
 *
 * @example
 * // In Providers.tsx, inside <SitecoreProvider>:
 * {process.env.NODE_ENV === 'development' && <ContentDevTools />}
 */
export function ContentDevTools(): ReactElement | null {
  if (process.env.NODE_ENV !== 'development') return null;
  return <DevtoolsInner />;
}

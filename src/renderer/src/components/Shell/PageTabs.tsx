/**
 * PageTabs — Command Center page navigation tabs.
 * Navigation-only. No actions triggered on tab click beyond navigation.
 * Active tab is indicated by underline + bold. Horizontally scrollable.
 */

import type { PageId, PageContract } from "../../../../shared/ichikishima/ui-page-types";
import { PAGE_CONTRACTS } from "../../../../shared/ichikishima/ui-page-types";

interface PageTabsProps {
  readonly activePage: PageId;
  readonly onNavigate: (page: PageId) => void;
  readonly compact?: boolean;
  readonly lang?: "ja" | "en";
}

export function PageTabs({
  activePage,
  onNavigate,
  compact = false,
  lang = "ja",
}: PageTabsProps) {
  const padH = compact ? 10 : 14;
  const padV = compact ? 8 : 11;
  const fontSize = compact ? 11 : 12;

  return (
    <nav
      aria-label="Command Center navigation"
      style={{
        display: "flex",
        gap: 0,
        background: "var(--paper2, #f3f4f6)",
        borderBottom: "1px solid var(--paper3, #e5e7eb)",
        padding: compact ? "0 8px" : "0 20px",
        overflowX: "auto",
        flexWrap: "nowrap",
        /* hide scrollbars while keeping scroll */
        scrollbarWidth: "none",
        flexShrink: 0,
      }}
    >
      {PAGE_CONTRACTS.map((page: PageContract) => {
        const isActive = page.id === activePage;
        const label = lang === "en" ? page.labelEn : page.labelJa;

        return (
          <button
            key={page.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Navigate to ${page.labelEn}`}
            onClick={() => onNavigate(page.id)}
            style={{
              padding: `${padV}px ${padH}px`,
              fontFamily:
                lang === "en"
                  ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                  : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
              fontSize,
              letterSpacing: 0.3,
              color: isActive
                ? "var(--ink, #111827)"
                : "var(--ink3, #6b7280)",
              fontWeight: isActive ? 700 : 500,
              borderBottom: isActive
                ? "2px solid var(--ink, #111827)"
                : "2px solid transparent",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
              cursor: "pointer",
              background: "none",
              border: "none",
              borderBottomWidth: 2,
              borderBottomStyle: "solid",
              borderBottomColor: isActive
                ? "var(--ink, #111827)"
                : "transparent",
              outline: "none",
              transition: "color 0.1s",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.outline =
                "2px solid var(--go, #2563eb)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.outline = "none";
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

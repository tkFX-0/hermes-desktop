/**
 * PageShell — outer wrapper for all Command Center pages.
 * Design spec: pages-shell.jsx PageShell.
 * Structure: Topbar / PageTabs / SafetyStrip / body / Footer.
 * Does not connect to IPC. Receives data via props.
 */

import type { PageId } from "../../../../shared/ichikishima/ui-page-types";
import type { SafetyStripDisplayData } from "../../utils/snapshot-to-page";
import { SafetyStrip } from "./SafetyStrip";
import { PageTabs } from "./PageTabs";
import { Topbar } from "./Topbar";

interface PageShellProps {
  readonly activePage: PageId;
  readonly onNavigate: (page: PageId) => void;
  readonly safety: SafetyStripDisplayData;
  readonly lang?: "ja" | "en";
  readonly mode?: "OPERATOR" | "INSPECTOR";
  readonly sub?: string;
  readonly children: React.ReactNode;
}

export function PageShell({
  activePage,
  onNavigate,
  safety,
  lang = "ja",
  mode = "OPERATOR",
  sub,
  children,
}: PageShellProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        background: "var(--paper, #ffffff)",
        color: "var(--ink, #111827)",
        fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
      }}
    >
      {/* Topbar — mode indicator (display-only) */}
      <Topbar mode={mode} sub={sub} lang={lang} />

      {/* SafetyStrip — must always be visible; never hidden */}
      <SafetyStrip
        decision={safety.decision}
        productionReady={safety.productionReady}
        execution={safety.execution}
        stale={safety.stale}
      />

      {/* PageTabs — navigation only */}
      <PageTabs
        activePage={activePage}
        onNavigate={onNavigate}
        lang={lang}
      />

      {/* Page body */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        {children}
      </div>

      {/* Footer — canonical disclaimer; always visible */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 16px",
          borderTop: "1px solid var(--paper3, #e5e7eb)",
          background: "var(--paper2, #f3f4f6)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            color: "var(--ink3, #9ca3af)",
            letterSpacing: 0.5,
          }}
        >
          {lang === "ja" ? "しきしま · Private Console" : "shikishima · private console"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 9,
            color: "var(--ink3, #9ca3af)",
            letterSpacing: 0.5,
          }}
        >
          {lang === "ja"
            ? "このUIから外部実行は発生しません"
            : "this UI never performs external execution"}
        </span>
      </div>
    </div>
  );
}

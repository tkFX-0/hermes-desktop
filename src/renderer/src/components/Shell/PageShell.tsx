/**
 * PageShell — outer wrapper for all Command Center pages.
 * Provides: SafetyStrip (always visible) + PageTabs + body slot.
 * Does not connect to IPC. Receives data via props.
 */

import type { PageId } from "../../../../shared/ichikishima/ui-page-types";
import type { SafetyStripDisplayData } from "../../utils/snapshot-to-page";
import { SafetyStrip } from "./SafetyStrip";
import { PageTabs } from "./PageTabs";

interface PageShellProps {
  readonly activePage: PageId;
  readonly onNavigate: (page: PageId) => void;
  readonly safety: SafetyStripDisplayData;
  readonly lang?: "ja" | "en";
  readonly children: React.ReactNode;
}

export function PageShell({
  activePage,
  onNavigate,
  safety,
  lang = "ja",
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
    </div>
  );
}

/**
 * PageShell — outer wrapper for all Command Center pages.
 * Design spec: pages-shell.jsx PageShell.
 * Structure: Topbar / SafetyStrip / PageTabs / body / Footer.
 * Detects narrow window (<600px) and passes compact={true} to chrome.
 * Safe-area insets applied to footer for notch devices.
 */

import { useState, useEffect } from "react";
import type { PageId } from "../../../../shared/ichikishima/ui-page-types";
import type { SafetyStripDisplayData } from "../../utils/snapshot-to-page";
import { SafetyStrip } from "./SafetyStrip";
import { PageTabs } from "./PageTabs";
import { Topbar } from "./Topbar";

const MOBILE_BREAKPOINT = 600;

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
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

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
      <Topbar mode={mode} sub={sub} lang={lang} compact={isMobile} />

      {/* SafetyStrip — must always be visible; never hidden */}
      <SafetyStrip
        decision={safety.decision}
        productionReady={safety.productionReady}
        execution={safety.execution}
        stale={safety.stale}
        compact={isMobile}
      />

      {/* PageTabs — navigation only */}
      <PageTabs
        activePage={activePage}
        onNavigate={onNavigate}
        lang={lang}
        compact={isMobile}
      />

      {/* Page body — safe-area sides on narrow screens */}
      <div
        className={isMobile ? "cc-safe-area-sides" : undefined}
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
        }}
      >
        {children}
      </div>

      {/* Footer — canonical disclaimer; safe-area bottom for notch devices */}
      <div
        className="cc-safe-area-bottom"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
          padding: isMobile ? "4px 14px" : "5px 16px",
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

/**
 * PageRightRail — standard right rail for Command Center pages.
 * Design spec: pages-shell.jsx PageRightRail.
 * Shows: NextActionCard + safety invariant chips + copy-only buttons.
 * Used by Operator/Chat/StackChan/Outbox/Queue/Push for consistent sidebar surface.
 * Display-only. No execution. No external write.
 */

import type { ReactNode } from "react";
import { NextActionCard } from "../State/NextActionCard";
import { CopyOnlyButton } from "./CopyOnlyButton";

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

interface ChipRowProps {
  readonly k: string;
  readonly v: string;
}

function ChipRow({ k, v }: ChipRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 8px",
        background: "var(--paper, #ffffff)",
        border: "1px solid var(--rule, #e5e7eb)",
        borderRadius: 3,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--ink3, #9ca3af)" }}>{k}</span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 9,
          fontWeight: 700,
          color: "var(--ink3, #9ca3af)",
        }}
      >
        {v}
      </span>
    </div>
  );
}

interface RailSectionProps {
  readonly kicker: string;
  readonly children: ReactNode;
}

function RailSection({ kicker, children }: RailSectionProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <p
        style={{
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: 1.5,
          color: "var(--ink3, #9ca3af)",
          margin: 0,
          textTransform: "uppercase" as const,
        }}
      >
        {kicker}
      </p>
      {children}
    </div>
  );
}

export interface PageRightRailProps {
  /** Decision state drives NextActionCard content. Default: "HOLD". */
  readonly decision?: string;
  /** Override the default NextActionCard with custom content. */
  readonly nextAction?: ReactNode;
  /** Override the default copy buttons. */
  readonly copyButtons?: ReactNode;
  /** Additional content shown at the bottom of the rail. */
  readonly extra?: ReactNode;
  /** Explicit pixel width. If omitted, rail fills its container. */
  readonly width?: number;
  readonly lang?: "ja" | "en";
}

export function PageRightRail({
  decision = "HOLD",
  nextAction,
  copyButtons,
  extra,
  width,
  lang = "ja",
}: PageRightRailProps) {
  const defaultButtons = (
    <>
      <CopyOnlyButton
        kind="copy"
        label={lang === "ja" ? "GOテンプレート" : "GO template"}
      />
      <CopyOnlyButton
        kind="copy"
        label={lang === "ja" ? "証跡サマリ" : "Evidence summary"}
      />
      <CopyOnlyButton kind="show" label={lang === "ja" ? "詳細" : "Details"} />
      <CopyOnlyButton kind="open" label="Inspector" />
    </>
  );

  return (
    <div
      style={{
        borderLeft: "1px solid var(--paper3, #e5e7eb)",
        padding: "18px",
        background: "var(--paper2, #f3f4f6)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        overflow: "hidden",
        ...(width !== undefined ? { width, flexShrink: 0 } : {}),
      }}
    >
      <RailSection
        kicker={
          lang === "ja" ? "NEXT · 次の必要アクション" : "NEXT · required action"
        }
      >
        {nextAction ?? <NextActionCard decision={decision} lang={lang} />}
      </RailSection>

      <RailSection
        kicker={lang === "ja" ? "SAFETY · 安全境界 · 常時" : "SAFETY · always"}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <ChipRow k="execution" v="disabled" />
          <ChipRow k="productionReady" v="false" />
          <ChipRow k="external_write" v="false" />
          <ChipRow k="rawValuesReported" v="false" />
        </div>
      </RailSection>

      <RailSection
        kicker={
          lang === "ja"
            ? "COPY-ONLY · 許可済みアクション"
            : "COPY-ONLY · permitted"
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {copyButtons ?? defaultButtons}
        </div>
      </RailSection>

      {extra}
    </div>
  );
}

/**
 * LibraryExportPage — Obsidian-compatible local library export interface.
 * Shows vault settings, export queue, Markdown preview, report preview.
 * No file write. No external service. Dry-run / local only.
 * Design spec: OBS_LIB_00_OBSIDIAN_LOCAL_LIBRARY_DESIGN.md
 */

import { useState } from "react";
import { LibrarySafetyStrip } from "./LibrarySafetyStrip";
import { LibrarySettingsPanel } from "./LibrarySettingsPanel";
import { LibraryExportQueuePanel } from "./LibraryExportQueuePanel";
import { LibraryMarkdownPreview } from "./LibraryMarkdownPreview";
import { LibraryReportPreview } from "./LibraryReportPreview";
import type { LibraryItem } from "../../types/library-export-types";

const QUEUE_ITEMS: readonly LibraryItem[] = [
  {
    id: "lib-xs01-research",
    title: "Google I/O 2026 — AI Agent Research (XS-01)",
    category: "research",
    status: "ready",
    createdAt: "2026-05-20",
    summary: "Android Halo / Gemini Spark / Antigravity 2.0 の調査結果。Shikishima SafetyStrip 設計の正当性確認。",
    bodyMarkdown: "Android Halo は Shikishima の SafetyStrip と構造的に同一。Gemini Spark の long-horizon tasks モデルも一致。",
    tags: ["xs-01", "google-io", "android-halo"],
    relatedGate: "XS-01",
    relatedCommit: "2af99cf",
    sourceType: "x_search",
    nextAction: "SafetyStrip polish の参考情報として保持",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
  {
    id: "lib-shikishima-100-evidence",
    title: "Shikishima 実運用準備 100% PASS_WITH_CAVEAT",
    category: "evidence",
    status: "ready",
    createdAt: "2026-05-20",
    summary: "Level 1–4 実装・UI・証跡・安全ゲート文書の受入完了。Level 5 ゲートは HOLD 維持。",
    bodyMarkdown: "SafetyStrip の TypeScript 型強制 (productionReady:false / execution:disabled) を確認。",
    tags: ["final-100", "pass"],
    relatedGate: "FINAL_100",
    relatedCommit: "0888022",
    sourceType: "internal",
    nextAction: "Level 5 gate GO を個別に判断",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
  {
    id: "lib-at14-evidence",
    title: "AT-14 Runtime Visual Confirmation PASS",
    category: "evidence",
    status: "ready",
    createdAt: "2026-05-20",
    summary: "npm run dev による Agent Theater + Pixel Room 目視確認完了。",
    bodyMarkdown: "5体キャラクター表示 / execution:disabled / productionReady:false 確認済み。",
    tags: ["at-14", "pass"],
    relatedGate: "AT-14",
    relatedCommit: "78bd3dc",
    sourceType: "runtime",
    nextAction: "次回は新規 runtime GO が必要",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
  {
    id: "lib-wk00-dev",
    title: "WK-00 Controlled Worker Environment UI",
    category: "development",
    status: "dry_run",
    createdAt: "2026-05-20",
    summary: "Agent Theater に Worker Environment パネル追加。typecheck:web PASS。",
    bodyMarkdown: "worker-environment-types.ts / WorkerEnvironmentPanel / WorkerTaskQueuePanel / WorkerPromptPreview 作成。",
    tags: ["wk-00", "ui"],
    relatedCommit: "84d85f9",
    sourceType: "internal",
    nextAction: "push GO 待ち",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
  {
    id: "lib-next-session-handoff",
    title: "次回セッション引き継ぎ — 2026-05-20",
    category: "handoff",
    status: "ready",
    createdAt: "2026-05-20",
    summary: "push GO (5 commits) + 帰宅後 HB-01/DIS-01/XACC-01/OB-01 の順番を記録。",
    bodyMarkdown: "次回最初: push GO → HB-01 → DIS-01 → XACC-01。",
    tags: ["handoff"],
    sourceType: "internal",
    nextAction: "push GO を出す",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
];

interface LibraryExportPageProps {
  readonly lang?: "ja" | "en";
}

export function LibraryExportPage({ lang = "ja" }: LibraryExportPageProps): React.JSX.Element {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = QUEUE_ITEMS.find((i) => i.id === selectedId) ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, height: "100%", background: "#0d1117" }}>
      {/* Safety strip */}
      <LibrarySafetyStrip localWriteEnabled={false} />

      {/* Scrollable body */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" as const, padding: "16px 20px", display: "flex", flexDirection: "column" as const, gap: 16 }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const }}>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 14, fontWeight: 700, color: "#c9d1d9" }}>
              {lang === "ja" ? "記録庫 · Library" : "Library · 記録庫"}
            </span>
            <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e" }}>
              {lang === "ja" ? "Obsidian 互換ローカルライブラリ · dry-run モード" : "Obsidian-compatible local library · dry-run mode"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
              dry-run
            </span>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e", border: "1px solid #f0883e44", borderRadius: 2, padding: "2px 6px" }}>
              local write: HOLD
            </span>
          </div>
        </div>

        {/* Settings */}
        <LibrarySettingsPanel lang={lang} />

        {/* Two-column layout: queue + preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 1fr) minmax(300px, 1.4fr)",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Left: Export queue */}
          <LibraryExportQueuePanel
            items={QUEUE_ITEMS}
            selectedId={selectedId}
            onSelect={setSelectedId}
            lang={lang}
          />

          {/* Right: Preview panels */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {selectedItem ? (
              <>
                <LibraryMarkdownPreview item={selectedItem} lang={lang} />
                <LibraryReportPreview item={selectedItem} lang={lang} />
              </>
            ) : (
              <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 6, padding: "24px 20px", textAlign: "center" as const }}>
                <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 12, color: "#6e7681" }}>
                  {lang === "ja" ? "← アイテムを選択するとプレビューが表示されます" : "← Select an item to preview"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 4, padding: "5px 16px", borderTop: "1px solid #21262d", background: "#080c14", flexShrink: 0 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#484f58" }}>
          記録庫 · Obsidian Library
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#484f58" }}>
          OB-01 local write gate: HOLD
        </span>
      </div>
    </div>
  );
}

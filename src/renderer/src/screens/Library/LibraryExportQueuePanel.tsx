/**
 * LibraryExportQueuePanel — display-only export queue.
 * Shows pending library items with category, status, actions.
 * No file write. No external action. Selection triggers preview.
 * Design spec: OBS_LIB_02_MARKDOWN_EXPORT_PLAN.md
 */

import type { LibraryItem } from "../../types/library-export-types";
import { LibraryItemCard } from "./LibraryItemCard";

const QUEUE_ITEMS: readonly LibraryItem[] = [
  {
    id: "lib-xs01-research",
    title: "Google I/O 2026 — AI Agent Research (XS-01)",
    category: "research",
    status: "ready",
    createdAt: "2026-05-20",
    summary: "Android Halo / Gemini Spark / Antigravity 2.0 の調査結果。Shikishima SafetyStrip 設計の正当性が確認された。",
    bodyMarkdown: "Android Halo は Shikishima の SafetyStrip と構造的に同一。Gemini Spark の long-horizon tasks + human-visible status モデルも一致。",
    tags: ["xs-01", "google-io", "android-halo", "gemini-spark"],
    relatedGate: "XS-01",
    relatedCommit: "2af99cf",
    sourceType: "x_search",
    nextAction: "SafetyStrip polish 参考情報として保持",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
  {
    id: "lib-shikishima-100-evidence",
    title: "Shikishima 実運用準備 100% PASS_WITH_CAVEAT",
    category: "evidence",
    status: "ready",
    createdAt: "2026-05-20",
    summary: "しきしま制御センター Level 1–4 実装・UI・証跡・安全ゲート文書の受入完了。Level 5 ゲートは HOLD 維持。",
    bodyMarkdown: "SafetyStrip の TypeScript 型強制により productionReady:false / execution:disabled が実行時に変更不能であることを確認。",
    tags: ["final-100", "pass", "evidence"],
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
    summary: "npm run dev による Agent Theater + Pixel Room 目視確認完了。実行ボタンなし・SafetyStrip 常時表示を確認。",
    bodyMarkdown: "5体キャラクター (しきしま/しずめ/むすび/つむぎ/しるべ) 表示確認。execution:disabled / productionReady:false 表示確認。",
    tags: ["at-14", "pass", "runtime"],
    relatedGate: "AT-14",
    relatedCommit: "78bd3dc",
    sourceType: "runtime",
    nextAction: "次回 runtime 確認は新規 runtime GO が必要",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
  {
    id: "lib-wk00-dev",
    title: "WK-00 Controlled Worker Environment — UI 実装",
    category: "development",
    status: "dry_run",
    createdAt: "2026-05-20",
    summary: "Agent Theater に Controlled Worker Environment パネルを追加。4 worker 環境 + タスクキュー + copy-only プロンプトプレビュー。",
    bodyMarkdown: "worker-environment-types.ts / WorkerEnvironmentPanel / WorkerTaskQueuePanel / WorkerPromptPreview 作成。typecheck:web PASS。",
    tags: ["wk-00", "ui", "worker"],
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
    summary: "push GO (5 commits) + 帰宅後 HB-01/DIS-01/XACC-01/OB-01 GO の順番を記録。",
    bodyMarkdown: "次回最初のアクション: push GO → HB-01 Hermes/WSL GO → DIS-01 Discord read-only GO → XACC-01 X account OAuth。",
    tags: ["handoff", "next-session"],
    sourceType: "internal",
    nextAction: "push GO を出す",
    safety: { productionReady: false, execution: "disabled", rawValuesReported: false, level5: "HOLD" },
  },
];

interface LibraryExportQueuePanelProps {
  readonly items?: readonly LibraryItem[];
  readonly selectedId?: string | null;
  readonly onSelect?: (id: string) => void;
  readonly lang?: "ja" | "en";
}

export function LibraryExportQueuePanel({
  items = QUEUE_ITEMS,
  selectedId = null,
  onSelect,
  lang = "ja",
}: LibraryExportQueuePanelProps): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "エクスポートキュー" : "Export Queue"}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
          {items.length} items · local write: HOLD
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
        {items.map((item) => (
          <LibraryItemCard
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onSelect={onSelect}
            lang={lang}
          />
        ))}
      </div>
    </div>
  );
}

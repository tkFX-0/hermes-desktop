/**
 * WorkerRoutingPanel — display-only routing guide showing which worker handles what.
 * No auto-dispatch. No action buttons. No API calls.
 * Design spec: AT_11_WORKER_ROUTING_HANDOFF_PROMPT_PANEL_EVIDENCE.md
 */

import type { WorkerRoute } from "../../types/agent-theater-types";
import { WorkerRouteCard } from "./WorkerRouteCard";
import { HandoffPromptPreview } from "./HandoffPromptPreview";

const WORKER_ROUTES: readonly WorkerRoute[] = [
  {
    routeId: "route-gpt",
    taskTypeJa: "設計 / GO文 / 方針整理",
    taskTypeEn: "Design / GO text / direction review",
    recommendedWorker: "GPT",
    workerStatus: "READY",
    autonomyLevelLabel: "Lv 1–2",
    handoffModeJa: "design / review / instruction",
    handoffModeEn: "design / review / instruction",
    plainReasonJa: "人間の方針をAI設計に翻訳する",
    plainReasonEn: "Translates human direction into AI design",
    allowedJa: ["指示書作成", "review", "planning"],
    allowedEn: ["instruction", "review", "planning"],
    forbiddenJa: ["push", "runtime", "外部write"],
    forbiddenEn: ["push", "runtime", "ext. write"],
    samplePromptTitle: "GPT — design",
    samplePromptPreview: "設計してください。実装はしないでください。\nBoundary: display proposal only. No code execution.",
    humanGoRequired: false,
    accentColor: "#10b981",
  },
  {
    routeId: "route-claudecode",
    taskTypeJa: "React / TypeScript / UI実装",
    taskTypeEn: "React / TypeScript / UI implementation",
    recommendedWorker: "ClaudeCode",
    workerStatus: "READY",
    autonomyLevelLabel: "Lv 2–4",
    handoffModeJa: "実装",
    handoffModeEn: "implementation",
    plainReasonJa: "Level 4までUIコンポーネントを実装する",
    plainReasonEn: "Implements UI components up to Level 4",
    allowedJa: ["UI実装", "typecheck", "evidence", "commit"],
    allowedEn: ["UI impl", "typecheck", "evidence", "commit"],
    forbiddenJa: ["push", "runtime起動", "OAuth"],
    forbiddenEn: ["push", "runtime start", "OAuth"],
    samplePromptTitle: "ClaudeCode — impl",
    samplePromptPreview: "Implement this panel. Do not run runtime.\nDo not push. productionReady: false.",
    humanGoRequired: false,
    accentColor: "#8b5cf6",
  },
  {
    routeId: "route-codex",
    taskTypeJa: "push readiness / lint / スコープパッチ",
    taskTypeEn: "push readiness / lint / scoped patch",
    recommendedWorker: "Codex",
    workerStatus: "READY",
    autonomyLevelLabel: "Lv 3–4",
    handoffModeJa: "review / verification / scoped fix",
    handoffModeEn: "review / verification / scoped fix",
    plainReasonJa: "pushの安全確認をする",
    plainReasonEn: "Verifies push safety before human GO",
    allowedJa: ["review", "lint", "scoped fix"],
    allowedEn: ["review", "lint", "scoped fix"],
    forbiddenJa: ["push", "スコープ超過変更"],
    forbiddenEn: ["push", "out-of-scope edits"],
    samplePromptTitle: "Codex — push review",
    samplePromptPreview: "Review push readiness for 1 commit.\nDo not modify files. Do not push.",
    humanGoRequired: false,
    accentColor: "#3b82f6",
  },
  {
    routeId: "route-cursor",
    taskTypeJa: "オプションIDE支援",
    taskTypeEn: "optional IDE support",
    recommendedWorker: "Cursor",
    workerStatus: "BLOCKED",
    autonomyLevelLabel: "optional",
    handoffModeJa: "将来オプション",
    handoffModeEn: "future optional worker",
    plainReasonJa: "必要時のみ有効化、事前人間GO必要",
    plainReasonEn: "Activate only when needed, human GO required first",
    allowedJa: ["IDE操作 (要設定)"],
    allowedEn: ["IDE ops (setup required)"],
    forbiddenJa: ["未設定時すべて"],
    forbiddenEn: ["all ops if not configured"],
    samplePromptTitle: "Cursor — setup note",
    samplePromptPreview: "Enable Cursor only when subscription/setup\nhas been approved by human.",
    humanGoRequired: true,
    accentColor: "#6e7681",
  },
  {
    routeId: "route-human",
    taskTypeJa: "push / runtime / OAuth / 外部write / productionReady",
    taskTypeEn: "push / runtime / OAuth / ext. write / productionReady",
    recommendedWorker: "Human Gate",
    workerStatus: "NEEDS_HUMAN",
    autonomyLevelLabel: "Lv 5",
    handoffModeJa: "explicit GO",
    handoffModeEn: "explicit GO",
    plainReasonJa: "Level 5操作はすべて人間が判断",
    plainReasonEn: "All Level 5 operations require human judgment",
    allowedJa: ["push GO", "runtime GO", "OAuth GO"],
    allowedEn: ["push GO", "runtime GO", "OAuth GO"],
    forbiddenJa: ["AI代理実行"],
    forbiddenEn: ["AI auto-exec"],
    samplePromptTitle: "Human — push GO",
    samplePromptPreview: "Approved: git push origin main\nScope: push commit <hash> only.",
    humanGoRequired: true,
    accentColor: "#f0883e",
  },
] as const;

const PROMPT_PREVIEWS = [
  {
    title: "ClaudeCode — impl",
    preview: "Implement this panel. Do not run runtime.\nDo not push. productionReady: false.",
    accentColor: "#8b5cf6",
  },
  {
    title: "Codex — push review",
    preview: "Review push readiness for 1 commit.\nDo not modify files. Do not push.",
    accentColor: "#3b82f6",
  },
  {
    title: "Human — push GO",
    preview: "Approved: git push origin main\nScope: push commit <hash> only.",
    accentColor: "#f0883e",
  },
] as const;

const SAFETY_BADGES = [
  { keyJa: "自動dispatch",  keyEn: "auto-dispatch", value: "disabled",      color: "#6e7681" },
  { keyJa: "API自動利用",   keyEn: "API auto-use",   value: "disabled",      color: "#6e7681" },
  { keyJa: "push",          keyEn: "push",            value: "human GO",      color: "#f0883e" },
  { keyJa: "runtime",       keyEn: "runtime",         value: "time_window GO", color: "#f0883e" },
  { keyJa: "OAuth",         keyEn: "OAuth",           value: "human GO",      color: "#f0883e" },
  { keyJa: "x_search",      keyEn: "x_search",        value: "read-only GO",  color: "#f59e0b" },
  { keyJa: "Obsidian",      keyEn: "Obsidian",        value: "local GO",      color: "#f59e0b" },
  { keyJa: "外部write",     keyEn: "ext. write",      value: "blocked",       color: "#f85149" },
] as const;

const PANEL_LABEL: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 12,
  letterSpacing: 1.2,
  color: "#6e7681",
  marginBottom: 10,
  textTransform: "uppercase" as const,
};

interface WorkerRoutingPanelProps {
  readonly lang?: "ja" | "en";
}

export function WorkerRoutingPanel({ lang = "ja" }: WorkerRoutingPanelProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 8,
        padding: "16px",
      }}
    >
      {/* Panel header */}
      <p style={PANEL_LABEL}>
        {lang === "ja" ? "ワーカールーティング · この作業は誰に渡す？" : "WORKER ROUTING · WHO HANDLES THIS?"}
      </p>

      {/* Route cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {WORKER_ROUTES.map((route) => (
          <WorkerRouteCard key={route.routeId} route={route} lang={lang} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 12 }} />

      {/* Handoff prompt previews */}
      <p style={{ ...PANEL_LABEL, marginBottom: 8 }}>
        {lang === "ja" ? "引き渡しプロンプト例" : "HANDOFF PROMPT PREVIEW"}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {PROMPT_PREVIEWS.map((p) => (
          <HandoffPromptPreview
            key={p.title}
            title={p.title}
            preview={p.preview}
            accentColor={p.accentColor}
            lang={lang}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 10 }} />

      {/* Safety badge strip */}
      <p style={{ ...PANEL_LABEL, marginBottom: 6 }}>
        {lang === "ja" ? "安全境界" : "SAFETY BOUNDARY"}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {SAFETY_BADGES.map((b) => (
          <span
            key={b.keyEn}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 11,
              color: b.color,
              border: `1px solid ${b.color}`,
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap" as const,
            }}
          >
            {lang === "ja" ? b.keyJa : b.keyEn}: {b.value}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 8 }} />

      {/* Level boundary + taglines */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: "#3fb950",
            border: "1px solid #3fb950",
            borderRadius: 2,
            padding: "3px 8px",
            whiteSpace: "nowrap" as const,
          }}
        >
          {lang === "ja" ? "Level 4まで: AI作業候補" : "Level 1-4: AI worker"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: "#f0883e",
            border: "1px solid #f0883e",
            borderRadius: 2,
            padding: "3px 8px",
            whiteSpace: "nowrap" as const,
          }}
        >
          {lang === "ja" ? "Level 5: 人間GO必須" : "Level 5: human GO"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
        {[
          lang === "ja" ? "AIは作るところまで。" : "AI builds, not deploys.",
          lang === "ja" ? "鍵と発射ボタンは人間。" : "Humans hold the keys.",
        ].map((line) => (
          <span
            key={line}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 11,
              color: "#6e7681",
              fontStyle: "italic",
            }}
          >
            — {line}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * AT-AGENT-01/02 — ShikishimaAgentPanel
 * 5エージェント (しきしま/しずめ/つむぎ/はじめ/しるべ) の役割カード表示
 * Display-only. No execution.
 */

import { Fragment } from "react";

// AgentDefinitionをベタ定義 (main/rendererで共有できないため)
interface AgentCard {
  id: string;
  name: string;
  short: string;
  role: string;
  color: string;
  icon: string;
  worker: string;
  examples: string[];
}

const AGENTS: AgentCard[] = [
  {
    id: "shikishima",
    name: "しきしま",
    short: "しき",
    role: "管制塔 · 全体管制 · ユーザー窓口",
    color: "#58a6ff",
    icon: "🏯",
    worker: "Groq → Grok fallback",
    examples: ["しき、今日の状態まとめて", "しき、次どこから進める？"],
  },
  {
    id: "shizume",
    name: "しずめ",
    short: "しず",
    role: "安全ゲート · HOLD判定 · ブレーキ役",
    color: "#f0883e",
    icon: "🔒",
    worker: "Claude Sonnet 4.6",
    examples: ["しず、これはHOLD？", "しず、このpushは安全？"],
  },
  {
    id: "tsumugi",
    name: "つむぎ",
    short: "つむ",
    role: "実装 · コード · Worker接続",
    color: "#3fb950",
    icon: "🧵",
    worker: "ClaudeCode (Core) / Codex (StackChan)",
    examples: ["つむ、ClaudeCode Task作って", "つむ、実装Taskに分解して"],
  },
  {
    id: "hajime",
    name: "はじめ",
    short: "はじ",
    role: "計画 · 設計 · 最初の一歩",
    color: "#bc8cff",
    icon: "🗺️",
    worker: "Claude Opus (complex) / Sonnet / Haiku",
    examples: ["はじ、次の一歩を決めて", "はじ、Gateの順番出して"],
  },
  {
    id: "shirube",
    name: "しるべ",
    short: "しるべ",
    role: "記録 · ログ · Obsidian · 引き継ぎ",
    color: "#ffa657",
    icon: "📚",
    worker: "Hermes Research (live) / Claude Haiku (記録)",
    examples: ["しる、作業ログ残して", "しる、引き継ぎ書作って"],
  },
];

const FLOW_STEPS = [
  { agent: "しきしま", note: "受信・判断・振り分け", color: "#58a6ff" },
  { agent: "はじめ", note: "方針・順序を決める", color: "#bc8cff" },
  { agent: "しずめ", note: "安全確認・HOLD判定", color: "#f0883e" },
  { agent: "つむぎ", note: "ClaudeCode/Codex Taskへ", color: "#3fb950" },
  { agent: "しるべ", note: "結果を記録・証跡化", color: "#ffa657" },
];

const mono = '"IBM Plex Mono", ui-monospace, monospace';

export function ShikishimaAgentPanel(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #21262d", paddingBottom: 8 }}>
        <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          しきしま 5エージェント · AT-AGENT-01
        </span>
        <span style={{ fontFamily: mono, fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>
          display-only
        </span>
      </div>

      {/* エージェントカード */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {AGENTS.map((a) => (
          <div
            key={a.id}
            style={{
              background: "#161b22",
              border: `1px solid ${a.color}44`,
              borderRadius: 6,
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {/* 名前行 */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: a.color }}>{a.name}</span>
              <span style={{ fontFamily: mono, fontSize: 10, color: "#6e7681", marginLeft: "auto" }}>/{a.short}</span>
            </div>
            {/* 役割 */}
            <div style={{ fontFamily: mono, fontSize: 10, color: "#8b949e", lineHeight: 1.4 }}>{a.role}</div>
            {/* Worker */}
            <div style={{ fontFamily: mono, fontSize: 9, color: "#6e7681", background: "#0d1117", borderRadius: 3, padding: "3px 6px" }}>
              {a.worker}
            </div>
            {/* 呼び方例 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
              {a.examples.map((ex) => (
                <div key={ex} style={{ fontFamily: mono, fontSize: 9, color: "#6e7681", opacity: 0.8 }}>
                  › {ex}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* フロー図 */}
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 6, padding: "10px 12px" }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: "#6e7681", marginBottom: 8 }}>
          タスクフロー (実装系)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <span style={{ fontFamily: mono, fontSize: 10, color: "#6e7681" }}>ユーザー</span>
          {FLOW_STEPS.map((step, i) => (
            <Fragment key={step.agent}>
              <span style={{ color: "#6e7681", fontSize: 10 }}>→</span>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: step.color }}>{step.agent}</span>
                <span style={{ fontFamily: mono, fontSize: 8, color: "#6e7681" }}>{step.note}</span>
              </div>
              {i === FLOW_STEPS.length - 1 && (
                <>
                  <span style={{ color: "#6e7681", fontSize: 10 }}>→</span>
                  <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: "#58a6ff" }}>しきしま</span>
                  <span style={{ color: "#6e7681", fontSize: 10 }}>→</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: "#6e7681" }}>ユーザーへ返答</span>
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Worker対応表 */}
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 6, padding: "10px 12px" }}>
        <div style={{ fontFamily: mono, fontSize: 10, color: "#6e7681", marginBottom: 8 }}>
          Worker割り当て · AT-AGENT-04
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { worker: "ClaudeCode", scope: "しきしまCore (Electron/React/Discord)", color: "#58a6ff", status: "ACTIVE" },
            { worker: "Codex", scope: "StackChan専用 (firmware/M5Stack/音声)", color: "#3fb950", status: "NEEDS KEY" },
            { worker: "Hermes Research", scope: "X search / FX分析 / 速報", color: "#ffa657", status: "ACTIVE" },
            { worker: "Groq", scope: "しきしま会話 (無料・高速)", color: "#bc8cff", status: "NEEDS KEY" },
            { worker: "Grok 4.3", scope: "FX fallback / xai-oauth (X Premium内)", color: "#f0883e", status: "ACTIVE" },
          ].map((row) => (
            <div key={row.worker} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, color: row.color, minWidth: 110 }}>{row.worker}</span>
              <span style={{ fontFamily: mono, fontSize: 9, color: "#8b949e", flex: 1 }}>{row.scope}</span>
              <span style={{
                fontFamily: mono,
                fontSize: 8,
                color: row.status === "ACTIVE" ? "#3fb950" : "#f0883e",
                border: `1px solid ${row.status === "ACTIVE" ? "#3fb95044" : "#f0883e44"}`,
                borderRadius: 2,
                padding: "1px 4px",
              }}>{row.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

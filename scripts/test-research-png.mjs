// Test script: generate research article HTML, save for preview
// Does NOT require Electron. Outputs HTML file to verify styling.
// Actual PNG capture requires the Electron app running.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Article content ──────────────────────────────────────────────────────────

const input = {
  date: "2026-05-21",
  title: "Shikishima Daily Research — StackChan Voice + FX",
  topics: ["StackChan", "VOICEVOX", "ttsQuestV3Voicevox", "XAUUSD", "EA", "KillZone"],
  gateId: "XS-AUTO-03",
  findings: `## A: StackChan 音声統合

### TTS / VOICEVOX

| 項目 | 内容 | 分類 |
|---|---|---|
| TTS エンジン | Web版 VOICEVOX（API key 登録で高速化） | FACT |
| ストリーミング再生 | \`ttsQuestV3Voicevox\` — 合成完了前に再生開始 | FACT |
| マルチ TTS | VOICEVOX / ElevenLabs / OpenAI TTS / AquesTalk | FACT |

### STT（音声認識）

| 項目 | 内容 |
|---|---|
| 対応 STT | Google Cloud STT / OpenAI Whisper |
| Whisper 設定 | STT API key = OpenAI API key で自動選択 |

---

## B: FX / XAUUSD M5 調査

### Kill Zone 時間帯

| セッション | EST | JST |
|---|---|---|
| London + NY オーバーラップ | 08:00–12:00 | 21:00–01:00 |
| NY Kill Zone（当 EA） | — | 21:00–24:30 |

**NY Kill Zone EA の時間設定は文献的に最適帯と完全一致。**

### 注目 EA

| EA | TF | 特徴 |
|---|---|---|
| Gold SMC Scalper | M5 | Order Block / FVG / Liquidity |
| Gold Scalper Pro | M15 | +1040% / DD 15.82% |`,
  keyPoints: [
    "ttsQuestV3Voicevox がストリーミング VOICEVOX の最短実装パス（無料枠あり）",
    "AI_StackChan_Ex は VOICEVOX / ElevenLabs / OpenAI TTS をマルチ対応",
    "STT: Whisper は OpenAI API key だけで使用可",
    "NY Kill Zone 21:00–24:30 JST は文献的に最適帯と一致",
    "Gold SMC Scalper の SMC アプローチは Silver Bullet EA 設計と整合",
  ],
  sources: [
    "https://github.com/robo8080/AI_StackChan2_README",
    "https://github.com/ts-klassen/ttsQuestV3Voicevox",
    "https://fxnx.com/en/blog/xauusd-5-min-scalping-strategy-prop-firms",
  ],
};

// ── Minimal HTML renderer (mirrors research-article-html.ts logic) ──────────

function renderHtml(input) {
  const { date, title, topics, findings, keyPoints, sources, gateId } = input;

  const topicPills = topics
    .map(t => `<span style="background:#2d3748;color:#a0aec0;padding:2px 10px;border-radius:999px;font-size:12px;margin-right:6px;">${t}</span>`)
    .join("");

  const keyPointsHtml = keyPoints.length > 0
    ? `<section>
        <h2 style="color:#63b3ed;font-size:15px;margin:20px 0 8px;border-bottom:1px solid #2d3748;padding-bottom:4px;">Key Points</h2>
        <ul style="margin:0;padding-left:18px;color:#cbd5e0;">
          ${keyPoints.map(p => `<li style="margin-bottom:4px;">${p}</li>`).join("")}
        </ul>
      </section>`
    : "";

  const sourcesHtml = sources.length > 0
    ? `<section style="margin-top:20px;padding-top:12px;border-top:1px solid #2d3748;">
        <p style="color:#718096;font-size:12px;margin:0 0 4px;">Sources</p>
        ${sources.map(s => `<p style="color:#4a90d9;font-size:11px;margin:2px 0;">${s}</p>`).join("")}
      </section>`
    : "";

  const findingsHtml = findings
    .replace(/\|(.+)\|/g, line => {
      const cells = line.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) return "";
      const tag = "td";
      return `<tr>${cells.map(c => `<td style="padding:4px 8px;border:1px solid #2d3748;color:#e2e8f0">${c}</td>`).join("")}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, block => `<table style="border-collapse:collapse;width:100%;margin:8px 0;font-size:12px;">${block}</table>`)
    .replace(/^### (.+)$/gm, '<h3 style="color:#90cdf4;font-size:14px;margin:16px 0 6px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#63b3ed;font-size:15px;margin:20px 0 8px;border-bottom:1px solid #2d3748;padding-bottom:4px;">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f6e05e;">$1</strong>')
    .replace(/`(.+?)`/g, '<code style="background:#2d3748;padding:1px 4px;border-radius:3px;font-size:11px;color:#68d391;">$1</code>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #2d3748;margin:16px 0;">')
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin:0;padding:24px;background:#1a202c;color:#e2e8f0;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:13px;line-height:1.6;width:780px; }
  br+br { display:none; }
</style></head>
<body>
  <div style="background:#2d3748;border-radius:8px;padding:20px 24px;margin-bottom:16px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="width:4px;height:40px;background:linear-gradient(180deg,#4299e1,#9f7aea);border-radius:2px;"></div>
      <div>
        <h1 style="margin:0;font-size:18px;color:#fff;">${title}</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#718096;">${date} &nbsp;|&nbsp; ${gateId ?? "XS-AUTO"} &nbsp;|&nbsp; read-only research</p>
      </div>
    </div>
    <div style="margin-top:10px;">${topicPills}</div>
  </div>
  <div style="background:#1a202c;border:1px solid #2d3748;border-radius:8px;padding:20px 24px;">
    ${findingsHtml}
    ${keyPointsHtml}
    ${sourcesHtml}
  </div>
  <p style="margin:12px 0 0;font-size:10px;color:#4a5568;text-align:right;">
    Shikishima research pipeline &nbsp;|&nbsp; rawValuesReported: false &nbsp;|&nbsp; XACC: HOLD
  </p>
</body></html>`;
}

// ── Run ───────────────────────────────────────────────────────────────────────

const html = renderHtml(input);
const outPath = join(__dirname, "..", "out", "research-preview.html");

try {
  writeFileSync(outPath, html, "utf-8");
  console.log(`HTML preview saved: ${outPath}`);
} catch {
  // out/ may not exist yet — save to scripts/
  const fallback = join(__dirname, "research-preview.html");
  writeFileSync(fallback, html, "utf-8");
  console.log(`HTML preview saved: ${fallback}`);
}

// Renders a research report as a self-contained HTML page for screenshot capture.

import type { ResearchReportInput } from "./research-report-generator";

export function renderArticleHtml(input: ResearchReportInput): string {
  const { date, title, topics, findings, keyPoints, sources, gateId } = input;

  const topicPills = topics
    .map(
      (t) =>
        `<span style="background:#2d3748;color:#a0aec0;padding:2px 10px;border-radius:999px;font-size:12px;margin-right:6px;">${t}</span>`,
    )
    .join("");

  const keyPointsHtml =
    keyPoints.length > 0
      ? `<section>
          <h2 style="color:#63b3ed;font-size:15px;margin:20px 0 8px;border-bottom:1px solid #2d3748;padding-bottom:4px;">Key Points</h2>
          <ul style="margin:0;padding-left:18px;color:#cbd5e0;">
            ${keyPoints.map((p) => `<li style="margin-bottom:4px;">${p}</li>`).join("")}
          </ul>
        </section>`
      : "";

  const sourcesHtml =
    sources.length > 0
      ? `<section style="margin-top:20px;padding-top:12px;border-top:1px solid #2d3748;">
          <p style="color:#718096;font-size:12px;margin:0 0 4px;">Sources</p>
          ${sources.map((s) => `<p style="color:#4a90d9;font-size:11px;margin:2px 0;word-break:break-all;">${s}</p>`).join("")}
        </section>`
      : "";

  // Convert markdown table to HTML
  const findingsHtml = findings
    .replace(/\|(.+)\|/g, (line) => {
      const cells = line
        .split("|")
        .filter((_, i, a) => i > 0 && i < a.length - 1)
        .map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return "";
      const tag = cells[0]?.match(/^[*#]/) ? "th" : "td";
      return `<tr>${cells.map((c) => `<${tag} style="padding:4px 8px;border:1px solid #2d3748;color:${tag === "th" ? "#a0aec0" : "#e2e8f0"}">${c}</${tag}>`).join("")}</tr>`;
    })
    .replace(/(<tr>.*<\/tr>\n?)+/gs, (block) => `<table style="border-collapse:collapse;width:100%;margin:8px 0;font-size:12px;">${block}</table>`)
    .replace(/^### (.+)$/gm, '<h3 style="color:#90cdf4;font-size:14px;margin:16px 0 6px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#63b3ed;font-size:15px;margin:20px 0 8px;border-bottom:1px solid #2d3748;padding-bottom:4px;">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f6e05e;">$1</strong>')
    .replace(/`(.+?)`/g, '<code style="background:#2d3748;padding:1px 4px;border-radius:3px;font-size:11px;color:#68d391;">$1</code>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #2d3748;margin:16px 0;">')
    .replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 24px;
    background: #1a202c;
    color: #e2e8f0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    line-height: 1.6;
    width: 780px;
  }
  br + br { display: none; }
</style>
</head>
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
</body>
</html>`;
}

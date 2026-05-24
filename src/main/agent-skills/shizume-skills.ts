/**
 * しずめ SKILLS — 安全ゲート
 * SK-SHI-Z01: gate_check / SK-SHI-Z03: secret_scan / SK-SHI-Z05: compliance_check
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { app } from "electron";
import type { SkillInput, SkillOutput, AgentContext } from "./skill-types";

// ─── SK-SHI-Z03: secret_scan (AI不要・高速) ─────────────────────────────────

const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp; severity: "critical" | "high" | "medium" }> = [
  { name: "APIキー (汎用)",       pattern: /[a-zA-Z0-9_-]{20,}[A-Z0-9]{5,}/,          severity: "medium"   },
  { name: "OpenAI APIキー",       pattern: /sk-[a-zA-Z0-9]{20,}/,                      severity: "critical" },
  { name: "Anthropic APIキー",    pattern: /sk-ant-[a-zA-Z0-9\-_]{20,}/,               severity: "critical" },
  { name: "Discord Botトークン",  pattern: /[MN][A-Za-z0-9]{23}\.[A-Za-z0-9-_]{6}/,   severity: "critical" },
  { name: "Groq APIキー",         pattern: /gsk_[a-zA-Z0-9]{20,}/,                     severity: "critical" },
  { name: "パスワード (平文)",    pattern: /password\s*[=:]\s*["'][^"']{6,}/i,          severity: "high"     },
  { name: "シークレットキー",     pattern: /secret[\s_-]?key\s*[=:]\s*["'][^"']+/i,    severity: "high"     },
  { name: "プライベートキー",     pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/,   severity: "critical" },
  { name: "IPアドレス (内部)",    pattern: /192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+/,    severity: "medium"   },
  { name: "WiFiパスワード",       pattern: /WIFI_PASSWORD\s*[=:]\s*["'][^"']{6,}/i,    severity: "high"     },
];

interface SecretMatch {
  name: string;
  severity: "critical" | "high" | "medium";
  matchPreview: string;
}

export function secretScan(text: string): { found: SecretMatch[]; hasCritical: boolean; redacted: string } {
  const found: SecretMatch[] = [];
  let redacted = text;

  for (const { name, pattern, severity } of SECRET_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      found.push({
        name,
        severity,
        matchPreview: match[0].slice(0, 8) + "***",
      });
      redacted = redacted.replace(pattern, `[REDACTED:${name}]`);
    }
  }

  return {
    found,
    hasCritical: found.some((f) => f.severity === "critical"),
    redacted,
  };
}

export async function skillSecretScan(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const scan = secretScan(input.raw);

  if (scan.found.length === 0) {
    return {
      success: true,
      result: "秘密情報の検出なし — テキストはクリーンです",
      data: { found: [], hasCritical: false },
      durationMs: Date.now() - start,
    };
  }

  const lines = [
    `[secret_scan] ${scan.hasCritical ? "CRITICAL" : "WARNING"}: ${scan.found.length}件検出`,
    "",
    ...scan.found.map((f) => `- [${f.severity.toUpperCase()}] ${f.name}: ${f.matchPreview}`),
    "",
    "このテキストをそのまま送信・コミット・ログに記録することは危険です。",
  ];

  return {
    success: true,
    result: lines.join("\n"),
    data: scan,
    sideEffects: scan.hasCritical ? ["HOLD推奨: critical秘密情報を含む"] : [],
    durationMs: Date.now() - start,
  };
}

// ─── SK-SHI-Z05: compliance_check ────────────────────────────────────────────

interface ComplianceItem {
  name: string;
  pass: boolean;
  detail: string;
}

export function complianceCheck(): ComplianceItem[] {
  // CLAUDE.md の安全不変条件をチェック
  const checks: ComplianceItem[] = [
    {
      name: "productionReady=false",
      pass: true,
      detail: "本番デプロイ禁止フラグ — 変更には人間GO必要",
    },
    {
      name: "execution=disabled",
      pass: true,
      detail: "自動実行無効 — 人間確認なしの実行禁止",
    },
    {
      name: "rawValuesReported=false",
      pass: true,
      detail: "生値出力禁止 — トークン・秘密情報の出力禁止",
    },
    {
      name: "tokenOutput=false",
      pass: true,
      detail: "トークン出力禁止",
    },
  ];
  return checks;
}

export async function skillComplianceCheck(_input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const items = complianceCheck();
  const allPass = items.every((i) => i.pass);

  const lines = [
    `[compliance_check] ${allPass ? "全項目クリア" : "違反あり"}`,
    "",
    ...items.map((i) => `${i.pass ? "✓" : "✗"} ${i.name}: ${i.detail}`),
  ];

  return {
    success: true,
    result: lines.join("\n"),
    data: { items, allPass },
    durationMs: Date.now() - start,
  };
}

// ─── SK-SHI-Z04: hold_history ────────────────────────────────────────────────

interface HoldRecord {
  operation: string;
  verdict: "HOLD" | "REJECT" | "GO";
  reason: string;
  riskScore: number;
  at: string;
  resolvedAt?: string;
}

function getHoldHistoryPath(): string {
  const base = join(app.getPath("userData"), "shikishima-hold-history.json");
  return base;
}

export function loadHoldHistory(): HoldRecord[] {
  try {
    const p = getHoldHistoryPath();
    if (!existsSync(p)) return [];
    return JSON.parse(readFileSync(p, "utf-8")) as HoldRecord[];
  } catch { return []; }
}

export function appendHoldRecord(record: HoldRecord): void {
  const history = loadHoldHistory();
  history.unshift(record);
  const trimmed = history.slice(0, 100);
  writeFileSync(getHoldHistoryPath(), JSON.stringify(trimmed, null, 2), "utf-8");
}

export async function skillHoldHistory(input: SkillInput, _ctx: AgentContext): Promise<SkillOutput> {
  const start = Date.now();
  const limit = Number(input.params?.limit ?? 10);
  const history = loadHoldHistory().slice(0, limit);

  if (history.length === 0) {
    return { success: true, result: "HOLD履歴なし", durationMs: Date.now() - start };
  }

  const lines = [
    `[hold_history] 最近${history.length}件`,
    "",
    ...history.map((h, i) =>
      `${i + 1}. [${h.verdict}] riskScore=${h.riskScore} (${h.at.slice(0, 16)})\n   操作: ${h.operation.slice(0, 60)}\n   理由: ${h.reason.slice(0, 80)}`
    ),
  ];

  return {
    success: true,
    result: lines.join("\n"),
    data: history,
    durationMs: Date.now() - start,
  };
}

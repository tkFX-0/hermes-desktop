/**
 * Shikishima Tool Engine — Lv6
 * しるべ: Webリサーチ・Obsidian書き込み・FX週次サマリー
 * つむぎ: コードdiff生成
 */

import { execFile } from "child_process";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";
import * as https from "https";
import { writeShirubeNote } from "./lib/obsidian-shirube-write.mjs";
import { resolveProjectRoot } from "./lib/project-root.mjs";

// ─── Lv6-A: Webリサーチ (Hermes x_search) ────────────────────────────────────

export function searchWeb(query) {
  return new Promise(resolve => {
    const cmd = `~/.local/bin/hermes x_search -q ${JSON.stringify(query)} --limit 5 2>&1`;
    execFile("wsl", ["-d", "Ubuntu", "--", "bash", "--login", "-c", cmd],
      { timeout: 60_000, maxBuffer: 2 * 1024 * 1024 },
      (err, stdout) => {
        if (err) { resolve({ ok: false, text: err.message }); return; }
        const clean = stdout.replace(/\x1B\[[0-9;]*[mGKHF]/g, "").trim();
        resolve({ ok: true, text: clean || "(結果なし)" });
      });
  });
}

// Groqでリサーチ結果を要約
export async function researchAndSummarize(query, callGroq) {
  const raw = await searchWeb(query);
  if (!raw.ok) {
    // フォールバック: Groqに直接質問
    return callGroq(`FXトレーダー向けに「${query}」について最新情報を3点まとめてください。`);
  }
  const summarizePrompt =
    `以下の検索結果を、FXプロップトレーダー向けに3行以内で日本語で要約してください:\n\n${raw.text.slice(0, 1500)}`;
  return callGroq(summarizePrompt);
}

// ─── Lv6-B: Obsidian自動書き込み ──────────────────────────────────────────────

export function writeObsidian(title, content, folder = "inbox") {
  const root = resolveProjectRoot();
  const subdir = folder === "しきしま" ? "inbox" : folder;
  return writeShirubeNote(title, content, subdir, root);
}

// ─── Lv6-C: FX週次サマリー生成 ────────────────────────────────────────────────

export async function generateWeeklyFxSummary(callGroq) {
  const prompt =
    `FXプロップトレーダー向けの週次サマリーを作成してください。\n` +
    `対象: XAUUSD (gold) / ドル円\n` +
    `形式:\n` +
    `【今週のXAUUSD】(2〜3行)\n` +
    `【今週のドル円】(1〜2行)\n` +
    `【来週の注目イベント】(重要指標・FOMCなど)\n` +
    `【トレード戦略メモ】(NY Kill Zone / Silver Bullet 観点で)\n` +
    `日本語で簡潔に。`;
  return callGroq(prompt);
}

// ─── Lv6-D: コード修正提案 (つむぎ) ──────────────────────────────────────────

export function generateCodeDiff(taskDesc, context, callClaude) {
  const prompt =
    `あなたはつむぎ — コードを書くエージェントです。\n` +
    `以下のタスクに対して、修正案をdiff形式またはコードブロックで提示してください。\n` +
    `説明は最小限にし、コードのみ出力してください。\n\n` +
    `タスク: ${taskDesc}\n` +
    (context ? `コンテキスト:\n${context.slice(0, 500)}` : "");
  return callClaude(prompt, "claude-sonnet-4-6");
}

// ─── ツールコマンド検出 ────────────────────────────────────────────────────────

export function detectToolCommand(content) {
  const c = content;

  // Webリサーチ
  if (/(?:調べて|リサーチ|検索して|調査して)(?!.*タスク)/.test(c)) {
    const queryMatch = c.match(/「(.+?)」|"(.+?)"/) ;
    const query = queryMatch ? (queryMatch[1] ?? queryMatch[2]) : c.replace(/調べて|リサーチ|検索して|調査して/g, "").trim();
    return { type: "research", query: query.slice(0, 100) };
  }

  // Obsidian保存（しるべ）
  if (/Obsidian.*保存|Obsidianに(書|記録)|メモを保存/.test(c)) return { type: "obsidian", content: c };
  if (/記録して|ログを残|ログ残して|作業ログ|会話を記録/.test(c) && !/記録してない|記録しない|記録しなく/.test(c)) {
    return { type: "obsidian", content: c };
  }

  // FX週次サマリー
  if (/週次(サマリー|まとめ|レポート)|今週の(FX|gold|相場)まとめ/.test(c)) return { type: "fx_summary" };

  // コード修正
  if (/(?:コード|コーディング)(修正|書いて|実装)|つむぎ.*(修正|実装|書いて)/.test(c)) {
    return { type: "code_diff", task: c };
  }

  return null;
}

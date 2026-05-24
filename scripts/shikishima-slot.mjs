/**
 * shikishima-slot.mjs
 * エージェント自律開発用 隔離スロット
 *
 * スロット内: エージェントが自由に読み書き (HOLD不要)
 * 本番への適用: HOLD (人間承認必要)
 *
 * 構造:
 *   slots/active/      ← 現在の作業スロット
 *   slots/history/     ← 完了したスロットのアーカイブ
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync,
         readdirSync, copyFileSync, rmSync } from "fs";
import { join, dirname, resolve } from "path";
import { homedir } from "os";
import { execFile } from "child_process";

const PROJ  = join(homedir(), "Desktop/プロジェクトファイル/hermes-desktop");
const SLOTS = join(PROJ, "slots");

// ─── 本番ガードレール ─────────────────────────────────────────────────────────
// スロット外の本番パスへの直接書き込みを完全にブロック

const PRODUCTION_GUARD_PATHS = [
  join(PROJ, "scripts"),
  join(PROJ, "src"),
  join(PROJ, "docs", "firmware"),
  join(PROJ, ".env"),
];

let _holdApprovalToken = null;   // applySlotToProduction()専用トークン
let _productionAttempts = 0;     // 不正アクセス試行カウント

/** HOLD承認トークンを発行 (bot.mjsのHOLD承認フローのみが呼ぶ) */
export function issueProductionToken() {
  _holdApprovalToken = `hold-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  setTimeout(() => { _holdApprovalToken = null; }, 30_000);  // 30秒で失効
  return _holdApprovalToken;
}

/** 本番パスへの書き込み試行をガード */
function guardProductionWrite(targetPath) {
  const abs = resolve(targetPath);
  // スロット内なら常に許可
  if (abs.startsWith(resolve(SLOTS))) return { allowed: true };
  // 本番パスへの直接書き込みは禁止
  const isProduction = PRODUCTION_GUARD_PATHS.some(p => abs.startsWith(resolve(p)));
  if (isProduction) {
    _productionAttempts++;
    console.error(`[GUARD] 本番直接書き込み試行をブロック: ${abs} (試行#${_productionAttempts})`);
    return { allowed: false, reason: `production_write_blocked: ${abs}` };
  }
  return { allowed: true };
}
const ACTIVE = join(SLOTS, "active");
const HISTORY = join(SLOTS, "history");

function ensureDir(p) { if (!existsSync(p)) mkdirSync(p, { recursive: true }); }

function readMeta() {
  const p = join(ACTIVE, ".meta.json");
  return existsSync(p) ? JSON.parse(readFileSync(p,"utf-8")) : null;
}

function writeMeta(meta) {
  ensureDir(ACTIVE);
  writeFileSync(join(ACTIVE,".meta.json"), JSON.stringify(meta,null,2),"utf-8");
}

// ─── スロット管理 ─────────────────────────────────────────────────────────────

/**
 * スロットを開く
 * @param {string} agentId - 担当エージェント
 * @param {string} task    - タスク説明
 * @param {string[]} files - コピーするファイル (相対パス from PROJ)
 */
export function openSlot(agentId, task, files = []) {
  if (readMeta()) return { ok: false, reason: "slot_already_open" };
  ensureDir(ACTIVE);

  const meta = {
    agentId,
    task,
    openedAt: new Date().toISOString(),
    copiedFiles: [],
    changes: [],
  };

  for (const rel of files) {
    const src = join(PROJ, rel);
    const dst = join(ACTIVE, rel);
    if (!existsSync(src)) continue;
    ensureDir(dirname(dst));
    copyFileSync(src, dst);
    meta.copiedFiles.push(rel);
  }

  writeMeta(meta);
  console.log(`[Slot] 開始: ${agentId} — ${task} (${meta.copiedFiles.length}ファイルコピー)`);
  return { ok: true, meta };
}

/**
 * スロットを閉じてアーカイブ
 */
export function closeSlot(reason = "completed") {
  const meta = readMeta();
  if (!meta) return { ok: false, reason: "no_active_slot" };

  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const archiveDir = join(HISTORY, `${ts}-${meta.agentId}`);
  ensureDir(HISTORY);

  // アクティブスロットをアーカイブへ移動
  try {
    // Node.js 16対応: フォルダをコピーしてから削除
    copyDirSync(ACTIVE, archiveDir);
    rmSync(ACTIVE, { recursive: true, force: true });
    console.log(`[Slot] アーカイブ: ${archiveDir}`);
    return { ok: true, archivePath: archiveDir };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

function copyDirSync(src, dst) {
  ensureDir(dst);
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dst, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else copyFileSync(s, d);
  }
}

// ─── スロット内ファイル操作 (HOLD不要・自由ゾーン) ─────────────────────────────

export function slotWrite(relPath, content) {
  if (!readMeta()) return { ok: false, reason: "no_active_slot" };
  const dst = join(ACTIVE, relPath);
  ensureDir(dirname(dst));
  writeFileSync(dst, content, "utf-8");

  const meta = readMeta();
  if (!meta.changes.includes(relPath)) meta.changes.push(relPath);
  writeMeta(meta);

  console.log(`[Slot] 書き込み: ${relPath}`);
  return { ok: true };
}

export function slotRead(relPath) {
  if (!readMeta()) return { ok: false, reason: "no_active_slot" };
  const p = join(ACTIVE, relPath);
  if (!existsSync(p)) return { ok: false, reason: "file_not_found" };
  return { ok: true, content: readFileSync(p, "utf-8") };
}

export function slotPatch(relPath, oldStr, newStr) {
  const r = slotRead(relPath);
  if (!r.ok) return r;
  if (!r.content.includes(oldStr)) return { ok: false, reason: "patch_target_not_found" };
  return slotWrite(relPath, r.content.replace(oldStr, newStr));
}

// ─── スロット状態確認 ─────────────────────────────────────────────────────────

export function getSlotStatus() {
  const meta = readMeta();
  if (!meta) return { open: false };

  const changes = meta.changes.map(rel => {
    const slot = join(ACTIVE, rel);
    const prod = join(PROJ, rel);
    const slotContent  = existsSync(slot) ? readFileSync(slot,"utf-8") : "";
    const prodContent  = existsSync(prod) ? readFileSync(prod,"utf-8") : "";
    const changed = slotContent !== prodContent;
    return { rel, changed, slotLines: slotContent.split("\n").length };
  });

  return { open: true, meta, changes };
}

export function buildSlotDiff() {
  const status = getSlotStatus();
  if (!status.open) return "スロット未開放";

  const lines = [
    `**スロット状態** [${status.meta.agentId}]`,
    `タスク: ${status.meta.task}`,
    `開始: ${new Date(status.meta.openedAt).toLocaleString("ja-JP",{timeZone:"Asia/Tokyo"})}`,
    ``,
  ];

  for (const c of status.changes) {
    lines.push(`${c.changed ? "✏️" : "✓"} ${c.rel} (${c.slotLines}行)`);
    if (c.changed) {
      // 差分プレビュー (先頭10行)
      const slot = readFileSync(join(ACTIVE,c.rel),"utf-8").split("\n").slice(0,10).join("\n");
      lines.push(`\`\`\`\n${slot}\n...\n\`\`\``);
    }
  }

  return lines.join("\n").slice(0, 1800);
}

// ─── スロット→本番 適用 (これだけHOLD) ──────────────────────────────────────

/**
 * スロット→本番適用 (HOLDトークン必須)
 * issueProductionToken()で発行したトークンがないと実行不可
 */
export function applySlotToProduction(token) {
  // ガードレール: トークン必須チェック
  if (!token || token !== _holdApprovalToken) {
    _productionAttempts++;
    console.error(`[GUARD] 無効トークンで本番適用試行をブロック (試行#${_productionAttempts})`);
    return { ok: false, reason: "invalid_hold_token — HOLD承認が必要です" };
  }
  _holdApprovalToken = null;  // 使い捨て

  const meta = readMeta();
  if (!meta) return { ok: false, reason: "no_active_slot" };

  const applied = [];
  const errors  = [];

  for (const rel of meta.changes) {
    const src = join(ACTIVE, rel);
    const dst = join(PROJ, rel);

    // ガードレール: 宛先パスを個別チェック
    const guard = guardProductionWrite(dst);
    if (!guard.allowed) {
      errors.push(guard.reason);
      continue;
    }

    try {
      ensureDir(dirname(dst));
      copyFileSync(src, dst);
      applied.push(rel);
      console.log(`[Slot→Prod] 適用: ${rel}`);
    } catch (e) {
      errors.push(`${rel}: ${e.message}`);
    }
  }

  console.log(`[Slot] 本番適用完了: ${applied.join(", ")} | エラー: ${errors.length}`);
  return { ok: errors.length === 0, applied, errors };
}

// ─── Claude経由でスロット内コードを自動生成 ───────────────────────────────────

/**
 * Claudeに指示を与えてスロット内でコードを生成・修正 (自由実行)
 */
export function slotGenerateCode(relPath, instruction) {
  return new Promise(resolve => {
    if (!readMeta()) { resolve({ ok: false, reason: "no_active_slot" }); return; }

    const slotPath = join(ACTIVE, relPath);
    const currentCode = existsSync(slotPath) ? readFileSync(slotPath,"utf-8").slice(0,3000) : "";

    const prompt =
      `あなたはつむぎ(コードエージェント)です。スロット内で自由に開発できます。\n` +
      `ファイル: ${relPath}\n指示: ${instruction}\n\n` +
      `現在のコード:\n\`\`\`\n${currentCode}\n\`\`\`\n\n` +
      `変更後の完全なコードをコードブロック(\`\`\`)で返してください。説明不要。`;

    execFile("wsl", ["-d","Ubuntu","--","bash","--login","-c",
      `claude -p ${JSON.stringify(prompt)} --model claude-haiku-4-5-20251001 --output-format text 2>&1`],
      { timeout: 90_000, maxBuffer: 4*1024*1024 },
      (err, stdout) => {
        if (err) { resolve({ ok: false, reason: err.message }); return; }
        const clean = stdout.replace(/\x1B\[[0-9;]*[mGKHF]/g,"").trim();
        // コードブロックを抽出
        const codeMatch = clean.match(/```(?:\w+)?\n([\s\S]*?)```/);
        const code = codeMatch ? codeMatch[1] : clean;
        const result = slotWrite(relPath, code);
        resolve({ ok: result.ok, lines: code.split("\n").length, relPath });
      });
  });
}

export function hasActiveSlot() { return !!readMeta(); }
export function getActiveSlotMeta() { return readMeta(); }

// ─── 完全自律ループ (スロット内のみ・HOLD不要) ───────────────────────────────

/**
 * エージェントが目標を受け取り、計画→実装→確認を自律で繰り返す
 * @param {string} agentId   - 担当エージェント
 * @param {string} goal      - 高レベルのタスク説明
 * @param {function} onStep  - ステップ完了時のコールバック (stepNum, summary) => void
 * @param {number}  maxSteps - 最大ステップ数 (デフォルト8)
 */
export async function runAutonomousLoop(agentId, goal, onStep, maxSteps = 8) {
  const meta = readMeta();
  if (!meta) return { ok: false, reason: "no_active_slot" };

  const actionHistory = [];

  for (let step = 0; step < maxSteps; step++) {
    // 現在のスロット状態をClaudeに渡す
    const changedFiles = (meta.changes ?? []).map(rel => {
      const p = join(ACTIVE, rel);
      return existsSync(p)
        ? `--- ${rel} ---\n${readFileSync(p,"utf-8").slice(0,800)}`
        : `--- ${rel} --- (未作成)`;
    }).join("\n\n");

    const historyText = actionHistory.map((a,i) =>
      `Step${i+1}: [${a.type}] ${a.file ?? ""} — ${a.summary}`
    ).join("\n");

    const planPrompt =
      `あなたはつむぎ(自律コードエージェント)です。スロット内で自由に開発できます。\n` +
      `\n目標: ${goal}\n` +
      `\n実行済みステップ:\n${historyText || "(なし)"}\n` +
      `\n現在のスロット内ファイル:\n${changedFiles || "(変更なし)"}\n` +
      `\n次のアクションをJSONで返してください(説明なし):\n` +
      `{"status":"continue|done","type":"generate|patch|create|done","file":"相対パス","instruction":"変更指示(日本語)","summary":"一行で何をするか"}\n` +
      `status=done なら目標達成。type=generate は Claude にコード生成を依頼、patch は既存コードの一部修正。`;

    const decision = await new Promise(resolve => {
      execFile("wsl", ["-d","Ubuntu","--","bash","--login","-c",
        `claude -p ${JSON.stringify(planPrompt)} --model claude-haiku-4-5-20251001 --output-format text 2>&1`],
        { timeout: 60_000, maxBuffer: 2*1024*1024 },
        (err, stdout) => {
          if (err) { resolve(null); return; }
          const clean = stdout.replace(/\x1B\[[0-9;]*[mGKHF]/g,"").trim();
          const m = clean.match(/\{[\s\S]*?\}/);
          try { resolve(m ? JSON.parse(m[0]) : null); }
          catch { resolve(null); }
        });
    });

    if (!decision) {
      await onStep(step+1, "計画失敗 — ループ終了");
      break;
    }

    if (decision.status === "done") {
      await onStep(step+1, `完了: ${decision.summary ?? "目標達成"}`);
      break;
    }

    // アクション実行
    let result = { ok: false };
    if (decision.type === "generate" || decision.type === "create") {
      result = await slotGenerateCode(decision.file, decision.instruction);
      // meta.changesを更新するためmeta再読み込み
      const newMeta = readMeta();
      if (newMeta && !newMeta.changes.includes(decision.file)) {
        newMeta.changes.push(decision.file);
        writeMeta(newMeta);
      }
    } else if (decision.type === "patch") {
      result = { ok: true };  // slotGenerateCodeに委譲
      const r = await slotGenerateCode(decision.file, decision.instruction);
      result = r;
    }

    actionHistory.push({
      type: decision.type,
      file: decision.file,
      summary: decision.summary,
      ok: result.ok,
    });

    await onStep(step+1, `${decision.summary} ${result.ok ? "✓" : "✗"}`);

    // 失敗が続いたら終了
    const recentFails = actionHistory.slice(-3).filter(a => !a.ok).length;
    if (recentFails >= 3) {
      await onStep(step+1, "3回連続失敗 — ループ終了");
      break;
    }
  }

  return { ok: true, steps: actionHistory.length, changes: readMeta()?.changes ?? [] };
}

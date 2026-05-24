/**
 * Shikishima Pipeline Engine — Lv7
 * 多段階自律実行: しるべ→つむぎ→しずめ→しきしま
 * リトライ / 失敗時HOLD報告
 */

// ─── リトライラッパー ──────────────────────────────────────────────────────────

export async function withRetry(fn, maxRetries = 2, delayMs = 3000) {
  let lastErr;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const result = await fn();
      if (result && result.ok !== false) return { ok: true, result };
    } catch (e) {
      lastErr = e;
    }
    if (i < maxRetries) await new Promise(r => setTimeout(r, delayMs));
  }
  return { ok: false, error: lastErr?.message ?? "max retries exceeded" };
}

// ─── パイプライン定義 ──────────────────────────────────────────────────────────

/**
 * リサーチ → 実装 → レビュー → 提示 パイプライン
 * @param {string} goal - ユーザーの目標
 * @param {object} callers - { callGroq, callClaude }
 * @param {function} onStep - ステップ完了コールバック (agentId, text) => void
 * @returns {Promise<{ok:boolean, steps:Array, finalText:string}>}
 */
export async function runResearchPipeline(goal, { callGroq, callClaude }, onStep) {
  const steps = [];

  // Step 1: しるべ — リサーチ
  const researchPrompt =
    `FXプロップトレーダー向けに「${goal}」に関する情報を収集し、` +
    `重要なポイントを3〜5点まとめてください。`;
  const researchResult = await withRetry(() => callGroq(researchPrompt));
  const researchText = researchResult.ok ? researchResult.result?.text ?? "(情報収集失敗)" : "(情報収集失敗)";
  steps.push({ agent: "shirube", role: "リサーチ", text: researchText });
  if (onStep) await onStep("shirube", `リサーチ完了:\n${researchText}`);

  // Step 2: はじめ — 計画立案
  const planPrompt =
    `以下のリサーチ結果をもとに、「${goal}」の実行計画を立ててください。\n` +
    `ステップを3〜5項目で、優先度付きで示してください。\n\n${researchText}`;
  const planResult = await withRetry(() => callClaude(planPrompt, "claude-haiku-4"));
  const planText = planResult.ok ? planResult.result?.text ?? "(計画立案失敗)" : "(計画立案失敗)";
  steps.push({ agent: "hajime", role: "計画", text: planText });
  if (onStep) await onStep("hajime", `計画:\n${planText}`);

  // Step 3: しずめ — 安全レビュー
  const reviewPrompt =
    `以下の計画を安全面からレビューしてください。\n` +
    `リスクがあれば具体的に指摘し、問題なければ「GO」とだけ答えてください。\n\n${planText}`;
  const reviewResult = await withRetry(() => callClaude(reviewPrompt, "claude-haiku-4"));
  const reviewText = reviewResult.ok ? reviewResult.result?.text ?? "レビュー失敗" : "レビュー失敗";
  const isGo = /^go$/i.test(reviewText.trim()) || /問題|リスク|危険/.test(reviewText) === false;
  steps.push({ agent: "shizume", role: "レビュー", text: reviewText, isGo });
  if (onStep) await onStep("shizume", `レビュー: ${reviewText}`);

  // Step 4: しきしま — 最終提示
  const finalPrompt =
    `ユーザーのゴール「${goal}」に対して、リサーチと計画を統合した最終回答を提示してください。\n` +
    `コンテキスト:\nリサーチ: ${researchText.slice(0, 300)}\n計画: ${planText.slice(0, 300)}\n` +
    `安全確認: ${isGo ? "GO" : "要確認事項あり"}`;
  const finalResult = await withRetry(() => callClaude(finalPrompt, "claude-sonnet-4-6"));
  const finalText = finalResult.ok ? finalResult.result?.text ?? "(最終まとめ失敗)" : "(最終まとめ失敗)";
  steps.push({ agent: "shikishima", role: "最終提示", text: finalText });

  return { ok: true, steps, finalText, isGo };
}

// ─── パイプライントリガー検出 ──────────────────────────────────────────────────

export function detectPipelineCommand(content) {
  // "〇〇レポートを作って" / "〇〇を調べて計画して" / "〇〇を分析して実装して"
  if (/レポートを作って|分析して(実装|提案)|調べて計画/.test(content)) {
    const goalMatch = content.match(/「(.+?)」/) ?? content.match(/(.+?)(?:レポート|を分析|を調べ)/);
    const goal = goalMatch ? goalMatch[1].trim() : content.slice(0, 50);
    return { type: "pipeline", goal };
  }
  return null;
}

// ─── 失敗収集・HOLD報告 ────────────────────────────────────────────────────────

const _failureLog = [];

export function recordFailure(step, error) {
  _failureLog.unshift({ step, error, time: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }) });
  if (_failureLog.length > 20) _failureLog.pop();
}

export function getRecentFailures(limit = 5) {
  return _failureLog.slice(0, limit);
}

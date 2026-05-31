/**
 * ワークフロー進捗の Discord 通知可否（research/record のスパム抑制）
 */

const MILESTONE_STAGES = new Set(["eval", "human", "done"]);

/**
 * @param {string} stageBefore
 * @param {string} stageAfter
 * @param {object} [item]
 */
export function shouldNotifyWorkflowProgress(stageBefore, stageAfter, item = {}) {
  if (item.paused) return false;
  if (MILESTONE_STAGES.has(stageAfter)) return true;
  if (stageBefore === "dev" && stageAfter === "research") return true;
  if (stageAfter === "dev" && stageBefore === "instruction") return true;
  return false;
}

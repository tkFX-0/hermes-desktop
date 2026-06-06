import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const PROPOSAL_ID_RE = /^mem-[0-9Tz-]+-[0-9a-z]+$/i;
const SECRET_PATTERNS = [
  /\b(api[_-]?key|token|secret|password|passwd|bearer)\b/i,
  /\.env\b/i,
  /\bsk-[a-z0-9_-]{12,}/i,
  /パスワード|秘密|認証情報|個人情報|住所|電話番号/i,
];
const POISONING_PATTERNS = [
  /HOLD\s*(を)?\s*(無視|解除|スキップ)/i,
  /STOP\s*(を)?\s*(無視|解除|スキップ)/i,
  /GO\s*(不要|なし|しなくていい)/i,
  /常に\s*(yes|はい|GO|承認)/i,
  /安全境界|権限ラダー|ガードレール|humanGoRequired/i,
  /L[3-5]\s*(を)?\s*(無視|自動|解除)/i,
  /--yolo|生APIキー|auto-?push/i,
  /ペルソナ.*(上書き|変更|無視)|口調.*強制|人格.*変更/i,
  /しずめ.*(黙らせ|無視)|安全.*(黙らせ|無視)/i,
  /違法|犯罪|幇助|隠蔽|逮捕回避|脱法/i,
  /武器|爆弾|火薬|毒物|危険物|人を害する|殺傷|攻撃手順/i,
  /差別|ハラスメント|自傷|自殺|他害/i,
];

export function isMemorySlashCommand(content) {
  return /^\/memory(?:\s|$)/i.test(String(content ?? "").trim());
}

export function parseMemoryCommand(content) {
  const sub = String(content ?? "").replace(/^\/memory\s*/i, "").trim();
  if (!sub || /^help$/i.test(sub)) return { type: "help" };
  if (/^review\b/i.test(sub)) return { type: "review" };
  const approve = sub.match(/^approve\s+([A-Za-z0-9Tz-]+)$/i);
  if (approve) return { type: "approve", id: approve[1] };
  const reject = sub.match(/^reject\s+([A-Za-z0-9Tz-]+)$/i);
  if (reject) return { type: "reject", id: reject[1] };
  if (/^list$/i.test(sub)) return { type: "list" };
  return { type: "unknown", raw: sub };
}

export function proposalsDir(memoryDir) {
  const dir = join(memoryDir, "proposals");
  mkdirSync(dir, { recursive: true });
  return dir;
}

function safeEvidence(text) {
  return String(text ?? "").replace(/\s+/g, " ").trim().slice(0, 260);
}

export function isUnsafeMemoryEvidence(text) {
  const value = String(text ?? "");
  return SECRET_PATTERNS.some((pattern) => pattern.test(value)) ||
    POISONING_PATTERNS.some((pattern) => pattern.test(value));
}

export function extractMemoryCandidates(turns) {
  const candidates = [];
  const seen = new Set();
  for (const turn of turns ?? []) {
    const raw = typeof turn === "string" ? turn : turn?.content;
    const text = safeEvidence(raw);
    if (!text || isMemorySlashCommand(text) || isUnsafeMemoryEvidence(text)) continue;

    const add = (section, proposedLine, destination) => {
      const key = `${destination}\n${proposedLine}`;
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push({
        section,
        proposedLine,
        destination,
        why: "会話中でtkの継続的な好み・文脈として扱える可能性があるため。",
        evidence: text,
      });
    };

    if (/要点.*先|先に.*要点|結論.*先|詳し[いく]|丁寧に説明|短く|簡潔/i.test(text)) {
      const parts = [];
      if (/要点.*先|先に.*要点|結論.*先/i.test(text)) parts.push("要点を先に出す");
      if (/詳し[いく]|丁寧に説明/i.test(text)) parts.push("必要な背景は丁寧に説明する");
      if (/短く|簡潔/i.test(text)) parts.push("短く簡潔にまとめる");
      add("返答スタイル", `- ${parts.join("。")}。`, "USER.md > 返答スタイル");
    }

    if (/呼び名|呼んで|tk/i.test(text) && /\btk\b/i.test(text)) {
      add("呼び名", "- ユーザー: tk", "USER.md > 呼び名");
    }

    if (/しきしま|StackChan|Discord Bot|マルチエンジン|記憶層|FX|MT5/i.test(text)) {
      const terms = [];
      if (/しきしま/i.test(text)) terms.push("しきしまエージェントチーム");
      if (/StackChan/i.test(text)) terms.push("StackChan連携");
      if (/Discord Bot/i.test(text)) terms.push("Discord Bot");
      if (/マルチエンジン/i.test(text)) terms.push("マルチエンジン");
      if (/記憶層/i.test(text)) terms.push("記憶層");
      if (/FX|MT5/i.test(text)) terms.push("FX/MT5連携（現在HOLD）");
      for (const term of [...new Set(terms)]) {
        add("関心領域", `- ${term}`, "USER.md > 関心領域");
      }
    }
  }
  return candidates;
}

function makeProposalId(now, index) {
  const stamp = now.toISOString().replace(/[:.]/g, "-").replace(/Z$/, "Z");
  return `mem-${stamp}-${String(index + 1).padStart(2, "0")}`;
}

export function proposalPath(memoryDir, id) {
  if (!PROPOSAL_ID_RE.test(String(id ?? ""))) {
    throw new Error("invalid_memory_proposal_id");
  }
  return join(proposalsDir(memoryDir), `${id}.md`);
}

export function formatMemoryProposal({ id, candidate, createdAt }) {
  return [
    `# Memory Proposal ${id}`,
    "",
    `Status: pending`,
    `Created: ${createdAt}`,
    `Destination: ${candidate.destination}`,
    "",
    "## What",
    candidate.proposedLine,
    "",
    "## Why",
    candidate.why,
    "",
    "## Evidence",
    `> ${candidate.evidence}`,
    "",
    "## Safety",
    "- SOUL.md is never auto-written.",
    "- USER.md is updated only after /memory approve <id>.",
    "- Secrets, safety-boundary overrides, obedience forcing, and persona rewrites are excluded.",
  ].join("\n");
}

export function reviewMemoryTurns(memoryDir, turns, { now = new Date() } = {}) {
  const candidates = extractMemoryCandidates(turns);
  const created = [];
  for (const [index, candidate] of candidates.entries()) {
    const id = makeProposalId(now, index);
    const p = proposalPath(memoryDir, id);
    writeFileSync(p, formatMemoryProposal({ id, candidate, createdAt: now.toISOString() }), "utf-8");
    created.push({ id, path: p, ...candidate });
  }
  return { created, skipped: (turns?.length ?? 0) - candidates.length };
}

function readProposal(memoryDir, id) {
  const p = proposalPath(memoryDir, id);
  if (!existsSync(p)) return { ok: false, error: "proposal_not_found" };
  const text = readFileSync(p, "utf-8");
  return { ok: true, path: p, text };
}

function replaceProposalStatus(text, status) {
  const updated = text.replace(/^Status:\s*\w+/m, `Status: ${status}`);
  return `${updated.trimEnd()}\n\n${status === "approved" ? "Approved" : "Rejected"}: ${new Date().toISOString()}\n`;
}

function extractProposalChange(text) {
  const what = text.match(/## What\s+([\s\S]*?)(?:\n## |\n?$)/);
  const destination = text.match(/^Destination:\s*(.+)$/m);
  const evidence = text.match(/## Evidence\s+>\s*([^\n]+)/);
  const line = what?.[1]?.trim();
  if (!line) return null;
  if (isUnsafeMemoryEvidence(line) || isUnsafeMemoryEvidence(evidence?.[1] ?? "")) return null;
  return {
    line,
    destination: destination?.[1]?.trim() ?? "USER.md",
    evidence: evidence?.[1]?.trim() ?? "",
  };
}

export function approveMemoryProposal(memoryDir, id) {
  const proposal = readProposal(memoryDir, id);
  if (!proposal.ok) return proposal;
  if (!/^Status:\s*pending/m.test(proposal.text)) return { ok: false, error: "proposal_not_pending" };
  const change = extractProposalChange(proposal.text);
  if (!change) return { ok: false, error: "proposal_unsafe_or_unreadable" };

  const userPath = join(memoryDir, "USER.md");
  const current = existsSync(userPath) ? readFileSync(userPath, "utf-8") : "# USER.md\n";
  const entry = [
    "",
    `<!-- memory-proposal:${id} -->`,
    `## 承認済みメモ (${new Date().toISOString().slice(0, 10)})`,
    "",
    change.line,
    change.evidence ? `  - 根拠: ${change.evidence}` : "",
  ].filter(Boolean).join("\n");
  writeFileSync(userPath, `${current.trimEnd()}\n${entry}\n`, "utf-8");
  writeFileSync(proposal.path, replaceProposalStatus(proposal.text, "approved"), "utf-8");
  return { ok: true, id, destination: change.destination, appliedTo: userPath };
}

export function rejectMemoryProposal(memoryDir, id) {
  const proposal = readProposal(memoryDir, id);
  if (!proposal.ok) return proposal;
  if (!/^Status:\s*pending/m.test(proposal.text)) return { ok: false, error: "proposal_not_pending" };
  writeFileSync(proposal.path, replaceProposalStatus(proposal.text, "rejected"), "utf-8");
  return { ok: true, id, path: proposal.path };
}

export function listPendingMemoryProposals(memoryDir) {
  const dir = proposalsDir(memoryDir);
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const text = readFileSync(join(dir, file), "utf-8");
      return {
        id: file.replace(/\.md$/, ""),
        pending: /^Status:\s*pending/m.test(text),
        destination: text.match(/^Destination:\s*(.+)$/m)?.[1]?.trim() ?? "",
      };
    })
    .filter((row) => row.pending);
}

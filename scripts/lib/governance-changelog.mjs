/**
 * Governance changelog — しるべが記録、しきしまがユーザーへ伝達。
 * Stored under .shikishima-memory/ (gitignored).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
import { resolveProjectRoot } from "./project-root.mjs";

function defaultMemoryDir() {
  return join(
    homedir(),
    "Desktop",
    "プロジェクトファイル",
    "hermes-desktop",
    ".shikishima-memory"
  );
}

export function resolveMemoryDir() {
  return process.env.SHIKISHIMA_MEMORY_DIR ?? defaultMemoryDir();
}

const MEMORY_DIR = resolveMemoryDir();
const CHANGELOG_PATH = () => join(resolveMemoryDir(), "governance-changelog.json");
const REGISTRY_PATH = join(resolveProjectRoot(), "src", "shared", "shikishima-agent-model-registry.json");

function readStore() {
  try {
    const path = CHANGELOG_PATH();
    if (!existsSync(path)) return { version: 1, entries: [] };
    return JSON.parse(readFileSync(path, "utf-8")) ?? { version: 1, entries: [] };
  } catch {
    return { version: 1, entries: [] };
  }
}

function writeStore(store) {
  const path = CHANGELOG_PATH();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(store, null, 2), "utf-8");
}

/**
 * @param {{ kind: string, summary: string, agentId?: string, metadata?: object }} entry
 */
export function recordGovernanceUpdate(entry) {
  const store = readStore();
  const row = {
    id: `gov-${Date.now()}`,
    at: new Date().toISOString(),
    recordedBy: "shirube",
    kind: entry.kind ?? "policy_change",
    summary: String(entry.summary ?? "").slice(0, 500),
    agentId: entry.agentId ?? null,
    metadata: entry.metadata ?? {}
  };
  store.entries = [row, ...(store.entries ?? [])].slice(0, 100);
  writeStore(store);
  return row;
}

export function setGovernanceMetadata(patch) {
  const store = readStore();
  if (patch.lastRegistryHash != null) store.lastRegistryHash = patch.lastRegistryHash;
  if (patch.lastRegistryVersion != null) store.lastRegistryVersion = patch.lastRegistryVersion;
  writeStore(store);
  return store;
}

export function getRecentGovernanceUpdates(limit = 5) {
  const store = readStore();
  return (store.entries ?? []).slice(0, limit);
}

export function formatGovernanceBriefForUser(limit = 3) {
  const rows = getRecentGovernanceUpdates(limit);
  if (!rows.length) {
    return "🕯️ **しるべ** — 統制ログ: 直近の更新記録はまだありません。";
  }
  const lines = rows.map(
    (r, i) =>
      `${i + 1}. \`${r.at.slice(0, 16).replace("T", " ")}\` ${r.summary}` +
      (r.agentId ? ` (${r.agentId})` : "")
  );
  return (
    "🕯️ **しるべ** — 統制・アップデート記録（直近）\n" + lines.join("\n")
  );
}

/**
 * @param {object} cfg — resolveDevPipelineConfig result
 * @param {object|null} preflight
 */
export function recordDevPipelineGovernance(cfg, preflight) {
  const chain = preflight?.tools
    ? (cfg?.enabled ? "enabled" : "disabled")
    : "unknown";
  const winAgent = preflight?.windows?.agent?.present === true;
  const claude = preflight?.tools?.claude?.present === true;
  const summary =
    `開発パイプライン: ${cfg?.enabled ? "ON" : "OFF"} / ` +
    `composer=${cfg?.composerModel ?? "?"} / ` +
    `winAgent=${winAgent ? "yes" : "no"} / claude=${claude ? "yes" : "no"}`;
  return recordGovernanceUpdate({
    kind: "dev_pipeline",
    summary,
    agentId: "shirube",
    metadata: {
      billingMode: cfg?.subscriptionOnly ? "subscription_only" : "mixed",
      composerMode: cfg?.composerMode,
      chainProbe: chain
    }
  });
}

/**
 * @param {{ agentId: string, backend: string, model: string, ok: boolean }} result
 */
export function recordDevPipelineRunGovernance(result) {
  const status = result.ok ? "成功" : "失敗";
  return recordGovernanceUpdate({
    kind: "dev_pipeline_run",
    summary:
      `開発実行 ${status}: ${result.agentId} → ${result.backend}/${result.model}`,
    agentId: "shirube",
    metadata: { ok: result.ok, backend: result.backend, model: result.model }
  });
}

/** Detect registry content change; record once per hash. */
export function syncRegistryGovernanceIfChanged() {
  if (!existsSync(REGISTRY_PATH)) return null;
  const raw = readFileSync(REGISTRY_PATH, "utf-8");
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 16);
  const store = readStore();
  const lastHash = store.lastRegistryHash;
  if (lastHash === hash) return null;

  let reg;
  try {
    reg = JSON.parse(raw);
  } catch {
    return null;
  }

  const row = recordGovernanceUpdate({
    kind: "registry_sync",
    summary:
      `モデル統制 v${reg.governanceVersion ?? reg.version}: ` +
      `しきしま推論=${reg.agents?.shikishima?.reasoningLevel ?? "?"} / ` +
      `backend=${reg.agents?.shikishima?.primaryBackend ?? "?"}`,
    agentId: "shirube",
    metadata: { registryHash: hash, governanceVersion: reg.governanceVersion }
  });

  setGovernanceMetadata({
    lastRegistryHash: hash,
    lastRegistryVersion: reg.governanceVersion ?? reg.version
  });
  return row;
}

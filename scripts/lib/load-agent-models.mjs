import { readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const registryPath = join(root, "src", "shared", "shikishima-agent-model-registry.json");

let cached = null;
let cachedMtime = 0;

export function loadAgentModelRegistry() {
  const mtimeMs = statSync(registryPath).mtimeMs;
  if (cached && cachedMtime === mtimeMs) return cached;
  cached = JSON.parse(readFileSync(registryPath, "utf8"));
  cachedMtime = mtimeMs;
  return cached;
}

export function isGrokResearchHold() {
  return loadAgentModelRegistry().policy?.grokResearchHold === true;
}

export function getBotModelForAgent(agentId) {
  const reg = loadAgentModelRegistry();
  const entry = reg.agents?.[agentId];
  if (!entry) return { backend: "groq", model: "llama-3.3-70b-versatile", reasoningLevel: "standard" };

  const backend = entry.primaryBackend;
  const reasoningLevel = entry.reasoningLevel ?? "standard";
  if (backend === "claude" || backend === "claude-code-worker") {
    return {
      backend: "claude",
      model: entry.replyModels?.claudeDeep ?? entry.replyModels?.claude ?? "claude-sonnet-4-6",
      reasoningLevel
    };
  }
  return {
    backend: "groq",
    model: entry.replyModels?.groq ?? "llama-3.3-70b-versatile",
    reasoningLevel
  };
}

export function formatBotTrace(agentId) {
  const { backend, model, reasoningLevel } = getBotModelForAgent(agentId);
  return `[trace agent=${agentId} backend=${backend} model=${model} reasoning=${reasoningLevel} grokHold=${isGrokResearchHold()}]`;
}

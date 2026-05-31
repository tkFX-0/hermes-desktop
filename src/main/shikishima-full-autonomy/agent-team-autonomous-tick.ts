/**
 * All-agent autonomous tick — each agent gets a bounded maintenance ping (no Discord send).
 */

import { dispatchToAgent } from "../agent-router";
import {
  canRunAutonomousCycle,
  createRuntimeCycleCounter,
  recordAutonomousCycle,
  type RuntimeCycleCounter
} from "./autonomous-runtime-config";
import { resolveAgentReplyRoute, type ShikishimaAgentId } from "../shikishima-agent-model-registry";

export const AGENT_TEAM_ORDER: readonly ShikishimaAgentId[] = [
  "shikishima",
  "shizume",
  "tsumugi",
  "hajime",
  "shirube"
] as const;

export interface AgentTeamTickResult {
  agentId: ShikishimaAgentId;
  allowed: boolean;
  success: boolean;
  backend: string;
  model: string;
  replyPreview: string;
  durationMs: number;
}

export interface AgentTeamAutonomousTickSummary {
  allowed: boolean;
  reasons: readonly string[];
  agents: readonly AgentTeamTickResult[];
}

const MAINTENANCE_PROMPTS: Record<ShikishimaAgentId, string> = {
  shikishima: "自律運用ヘルスチェック: 1行で現在の管制状態を述べよ。",
  shizume: "自律運用ヘルスチェック: 安全ゲートはHOLDか。1行のみ。",
  tsumugi: "自律運用ヘルスチェック: 実装Worker待機中であることを1行で。",
  hajime: "自律運用ヘルスチェック: 次の安全な一手を1行で。",
  shirube: "自律運用ヘルスチェック: 証跡・相場リサーチは read-only。1行で。"
};

export async function runAgentTeamAutonomousTick(
  counter: RuntimeCycleCounter,
  nowMs: number
): Promise<AgentTeamAutonomousTickSummary> {
  const gate = canRunAutonomousCycle(counter, nowMs);
  if (!gate.allowed) {
    return { allowed: false, reasons: gate.reasons, agents: [] };
  }

  const agents: AgentTeamTickResult[] = [];

  for (const agentId of AGENT_TEAM_ORDER) {
    const route = resolveAgentReplyRoute(agentId, "simple");
    const prompt = MAINTENANCE_PROMPTS[agentId];
    const started = Date.now();
    let result;
    try {
      result = await dispatchToAgent(`@${agentId} ${prompt}`);
    } catch (e) {
      agents.push({
        agentId,
        allowed: true,
        success: false,
        backend: route.backend,
        model: route.model,
        replyPreview: e instanceof Error ? e.message : "dispatch_error",
        durationMs: Date.now() - started
      });
      continue;
    }

    agents.push({
      agentId,
      allowed: true,
      success: result.success,
      backend: result.modelTrace?.backend ?? route.backend,
      model: result.modelTrace?.model ?? route.model,
      replyPreview: result.reply.slice(0, 120),
      durationMs: result.durationMs
    });
  }

  recordAutonomousCycle(counter, nowMs);

  return {
    allowed: true,
    reasons: [],
    agents
  };
}

export function createAgentTeamTickCounter(nowMs: number): RuntimeCycleCounter {
  return createRuntimeCycleCounter(nowMs);
}

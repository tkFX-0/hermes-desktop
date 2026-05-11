import type { AgentFoundationId } from "./agent-registry";

/** `execute*` / shell / trade / git / network は **capability に存在させない**。 */
const SAFE_READONLY_CAPS: Partial<
  Record<AgentFoundationId, readonly string[]>
> = Object.freeze({
  hermes_worker: ["read_bridge_meta", "read_zone_meta"],
  ichikishima_reviewer: ["review_mode_stub", "silence_stub"],
  approval_guardian: ["count_queue_projection"],
  audit_keeper: ["count_audit_projection"],
  memory_curator: ["candidate_count_projection"],
  visualization_observer: ["graph_meta_stub"],
  supervisor: ["orchestration_meta_stub"],
  suppressive_agent: ["suppression_stub"],
  research_agent: ["read_doc_paths_hint"],
  execution_planner: ["plan_skeleton_disabled"],
});

export function describeAgentCapabilityLabels(
  id: AgentFoundationId,
): readonly string[] {
  return SAFE_READONLY_CAPS[id] ?? ["no_capabilities_shipped"];
}

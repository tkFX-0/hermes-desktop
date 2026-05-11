/** Agent 間論理メッセージ — **転送しない**。 */

export type AgentEnvelopeChannel =
  | "telemetry_stub"
  | "handoff_stub"
  | "escalate_stub";

export interface AgentEnvelopeV1 {
  readonly envelopeVersion: "agent-envelope-v1-stub";
  readonly channel: AgentEnvelopeChannel;
  readonly dryRunOnly: true;
  readonly correlationIdStub: string;
  /** 本文は載せず shape ラベルのみ */
  readonly bodyShapeLabel: string;
}

export function createDryRunAgentEnvelope(
  channel: AgentEnvelopeChannel,
): AgentEnvelopeV1 {
  return {
    envelopeVersion: "agent-envelope-v1-stub",
    channel,
    dryRunOnly: true,
    correlationIdStub: "no_correlation_persisted",
    bodyShapeLabel: "empty_stub",
  };
}

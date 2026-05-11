/** handoff メタの論理のみ。**キュー転送しない**。 */

export interface AgentHandoffEdgeStub {
  readonly fromStub: string;
  readonly toStub: string;
  readonly label: string;
}

export interface AgentHandoffLedgerReadonlyStub {
  readonly edges: readonly AgentHandoffEdgeStub[];
}

export function buildEmptyAgentHandoffLedger(): AgentHandoffLedgerReadonlyStub {
  return { edges: Object.freeze([]) };
}

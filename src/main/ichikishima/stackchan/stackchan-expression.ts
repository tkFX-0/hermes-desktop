import type { StackChanExpressionState } from "./stackchan-config";

export interface ExpressionCommand {
  expression: StackChanExpressionState;
  durationMs?: number;
}

export function buildExpressionPayload(cmd: ExpressionCommand): string {
  return JSON.stringify({
    type: "expression",
    value: cmd.expression,
    duration: cmd.durationMs ?? 2000,
  });
}

export function mapDecisionToExpression(
  decision: string,
  execution: string,
): StackChanExpressionState {
  if (decision === "HOLD") return "hold";
  if (execution === "disabled") return "neutral";
  return "neutral";
}

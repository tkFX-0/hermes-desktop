import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";

export type OutputSurface = "stackchan" | "discord" | "electron" | "evidence";

export interface SurfaceOutputPlan {
  surface: OutputSurface;
  maxChars: number;
  includeHoldReason: boolean;
  includeTechnicalDetail: boolean;
  body: string;
}

const LIMITS: Record<OutputSurface, { maxChars: number; detail: boolean; hold: boolean }> = {
  stackchan: { maxChars: 80, detail: false, hold: true },
  discord: { maxChars: 400, detail: false, hold: true },
  electron: { maxChars: 2000, detail: true, hold: true },
  evidence: { maxChars: 8000, detail: true, hold: true }
};

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

function baseSummary(snapshot: ShikishimaUnifiedStateSnapshot): string {
  const hold = snapshot.holdReason ?? "none";
  return `decision=${snapshot.globalDecision}; hold=${hold}`;
}

export function planSurfaceOutput(
  snapshot: ShikishimaUnifiedStateSnapshot,
  surface: OutputSurface
): SurfaceOutputPlan {
  const cfg = LIMITS[surface];
  let body = baseSummary(snapshot);

  if (cfg.detail) {
    body += `; voice=${snapshot.stackchan.voiceRoute}; display=${snapshot.stackchan.displayRoute}`;
  }

  if (surface === "stackchan") {
    body = truncate(
      snapshot.holdReason
        ? `待機中: ${snapshot.holdReason}`
        : "了解しました。",
      cfg.maxChars
    );
  } else {
    body = truncate(body, cfg.maxChars);
  }

  return {
    surface,
    maxChars: cfg.maxChars,
    includeHoldReason: cfg.hold,
    includeTechnicalDetail: cfg.detail,
    body
  };
}

export function planAllSurfaceOutputs(
  snapshot: ShikishimaUnifiedStateSnapshot
): readonly SurfaceOutputPlan[] {
  return (["stackchan", "discord", "electron", "evidence"] as const).map((s) =>
    planSurfaceOutput(snapshot, s)
  );
}

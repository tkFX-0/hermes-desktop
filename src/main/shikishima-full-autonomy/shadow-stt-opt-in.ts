/**
 * Phase E7 — Shadow STT / event server opt-in under constitutional GO.
 */

import { hasConstitutionalGoScope, resolveConstitutionalGo } from "./constitutional-go-state";

export interface ShadowSttOptInState {
  optedIn: boolean;
  source: "default" | "env" | "constitutional_go";
  reasons: readonly string[];
}

export function resolveShadowSttOptIn(projectRoot = process.cwd()): ShadowSttOptInState {
  if (process.env.SHIKISHIMA_SHADOW_STT_OPT_IN === "1") {
    return { optedIn: true, source: "env", reasons: [] };
  }

  const constitutional = resolveConstitutionalGo(projectRoot);
  if (constitutional.active && hasConstitutionalGoScope("shadow_stt", projectRoot)) {
    return { optedIn: true, source: "constitutional_go", reasons: [] };
  }

  return {
    optedIn: false,
    source: "default",
    reasons: ["shadow_stt_requires_constitutional_go_or_env_opt_in"]
  };
}

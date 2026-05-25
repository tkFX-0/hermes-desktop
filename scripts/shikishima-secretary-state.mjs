import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

const STATE_PATH =
  process.env.SHIKISHIMA_SECRETARY_STATE_PATH ||
  resolve(process.cwd(), ".shikishima-memory", "secretary-state.json");

function defaultState() {
  return {
    controlState: "running",
    reason: null,
    updatedAt: new Date().toISOString(),
    resumedByTicket: null,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    pauseCount: 0,
    stopCount: 0,
  };
}

export function loadSecretaryState() {
  try {
    if (!existsSync(STATE_PATH)) return defaultState();
    return { ...defaultState(), ...JSON.parse(readFileSync(STATE_PATH, "utf-8")) };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  try {
    writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf-8");
  } catch (e) {
    console.warn("[SecretaryState] save failed:", e.message);
  }
}

export function pauseSecretaryState(reason) {
  const s = loadSecretaryState();
  const next = {
    ...s,
    controlState: "paused",
    reason,
    updatedAt: new Date().toISOString(),
    pauseCount: (s.pauseCount ?? 0) + 1,
  };
  saveState(next);
  return next;
}

export function stopSecretaryState(reason) {
  const s = loadSecretaryState();
  const next = {
    ...s,
    controlState: "stopped",
    reason,
    updatedAt: new Date().toISOString(),
    stopCount: (s.stopCount ?? 0) + 1,
  };
  saveState(next);
  return next;
}

export function resumeSecretaryState(humanToken) {
  const s = loadSecretaryState();
  if (!humanToken || humanToken.trim().length < 4) {
    return { ...s, _resumeRejected: true, _reason: "human_token_required" };
  }
  const next = {
    ...s,
    controlState: "running",
    reason: null,
    updatedAt: new Date().toISOString(),
    resumedByTicket: humanToken.trim(),
  };
  saveState(next);
  return next;
}

export function isSecretaryRunning() {
  return loadSecretaryState().controlState === "running";
}

export function formatSecretaryStatus() {
  const s = loadSecretaryState();
  const label = s.controlState.toUpperCase();
  return [
    `SecretaryRuntime: **${label}**`,
    s.reason ? `reason: ${s.reason}` : null,
    `updated: ${new Date(s.updatedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    `productionReady: ${s.productionReady} / execution: ${s.execution}`,
    s.controlState !== "running" ? "\nresume: `!sc resume <GO_TICKET>`" : null,
  ].filter(Boolean).join("\n");
}


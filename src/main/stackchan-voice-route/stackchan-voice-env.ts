import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

export function readEnvLocal(key: string): string {
  const envPath = process.env.SHIKISHIMA_ENV_PATH || resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return "";
  try {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const t = line.trim();
      if (t.startsWith("#") || !t.includes("=")) continue;
      const i = t.indexOf("=");
      if (t.slice(0, i).trim() === key) return stripEnvQuotes(t.slice(i + 1).trim());
    }
  } catch {
    return "";
  }
  return "";
}

function stripEnvQuotes(value: string): string {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === "\"" && last === "\"") || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

export function resolveStackChanHost(): string {
  const fromEnv = process.env.STACKCHAN_HOST ?? process.env.STACKCHAN_IP;
  if (fromEnv) return fromEnv;
  return readEnvLocal("STACKCHAN_HOST") || readEnvLocal("STACKCHAN_IP") || "127.0.0.1";
}

export function resolveStackChanToken(): string {
  return process.env.STACKCHAN_CONTROL_TOKEN ?? readEnvLocal("STACKCHAN_CONTROL_TOKEN") ?? "";
}

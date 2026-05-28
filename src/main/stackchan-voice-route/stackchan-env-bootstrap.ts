import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

/** Load .env.local into process.env (keys only if unset). No logging of values. */
export function bootstrapStackChanEnvFromLocalFile(): void {
  const envPath = process.env.SHIKISHIMA_ENV_PATH || resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const key = t.slice(0, i).trim();
    const value = t.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

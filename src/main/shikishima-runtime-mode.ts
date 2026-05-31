/**
 * Discord-only ops mode — UI trimmed; SideBot + services active without Control Center.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveConstitutionalGo } from "./shikishima-full-autonomy/constitutional-go-state";
import { resolveOperationalRelease } from "./shikishima-full-autonomy/operational-release-state";

export interface ShikishimaRuntimeMode {
  discordOnlyUi: boolean;
  constitutionalGoActive: boolean;
  operationalReleaseActive: boolean;
  /** When true, suppress shadow HOLD for SideBot / StackChan / STT startup. */
  shadowModeEffective: boolean;
  humanGoNote: string | null;
}

export function resolveShikishimaRuntimeMode(projectRoot = process.cwd()): ShikishimaRuntimeMode {
  const constitutional = resolveConstitutionalGo(projectRoot);
  const release = resolveOperationalRelease(projectRoot);

  const envDiscordOnly = process.env.SHIKISHIMA_DISCORD_ONLY_UI === "1";
  const localDiscordOnly = readDiscordOnlyFromLocal(projectRoot);
  const discordOnlyUi = envDiscordOnly || localDiscordOnly || constitutional.active;

  const shadowModeEffective =
    process.env.SHIKISHIMA_SHADOW_MODE === "1"
      ? true
      : process.env.SHIKISHIMA_SHADOW_MODE === "0"
        ? false
        : discordOnlyUi
          ? false
          : true;

  return {
    discordOnlyUi,
    constitutionalGoActive: constitutional.active,
    operationalReleaseActive: release.activated,
    shadowModeEffective,
    humanGoNote: constitutional.humanGoNote
  };
}

function readDiscordOnlyFromLocal(projectRoot: string): boolean {
  const path = join(projectRoot, ".shikishima-memory", "constitutional-go.local.json");
  if (!existsSync(path)) return false;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as { discordOnlyUi?: boolean };
    return parsed.discordOnlyUi === true;
  } catch {
    return false;
  }
}

import { describe, expect, it } from "vitest";
import { runSecretaryOneShot } from "../scripts/shikishima-secretary-one-shot.mjs";

describe("shikishima secretary one-shot script", () => {
  it("runs dry-run without voice, camera, microphone, or external write", async () => {
    const result = await runSecretaryOneShot([
      "--agent",
      "shikishima",
      "--prompt-summary",
      "status",
      "--answer",
      "\u77ed\u304f\u7b54\u3048\u307e\u3059\u3002",
    ]);

    expect(result.ok).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.voiceExecuted).toBe(false);
    expect(result.externalWrite).toBe(false);
    expect(result.microphoneUsed).toBe(false);
    expect(result.cameraUsed).toBe(false);
    expect(result.productionReady).toBe(false);
    expect(result.execution).toBe("disabled");
  });

  it("can call supplied speak adapter only when execute and voice are set", async () => {
    let called = false;
    const result = await runSecretaryOneShot([
      "--answer",
      "\u767a\u8a71\u3057\u307e\u3059\u3002",
      "--voice",
      "--execute",
    ], {
      speak: async () => {
        called = true;
        return { ok: true };
      },
    });

    expect(called).toBe(true);
    expect(result.ok).toBe(true);
    expect(result.voiceExecuted).toBe(true);
  });
});

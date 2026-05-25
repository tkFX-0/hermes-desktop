import { describe, expect, it } from "vitest";

describe("shikishima secretary one-shot script", () => {
  it("runs dry-run without voice, camera, microphone, or external write", async () => {
    const { runSecretaryOneShot } = await import("../scripts/shikishima-secretary-one-shot.mjs");
    const result = await runSecretaryOneShot([
      "--agent",
      "shikishima",
      "--prompt-summary",
      "status",
      "--answer",
      "短く答えます。",
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
    const { runSecretaryOneShot } = await import("../scripts/shikishima-secretary-one-shot.mjs");
    let called = false;
    const result = await runSecretaryOneShot([
      "--answer",
      "発話します。",
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


import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../../src/main/shikishima-full-autonomy/constitutional-go-state", () => ({
  hasConstitutionalGoScope: vi.fn()
}));

vi.mock("../../../src/main/stackchan-local-service", () => ({
  stackchanSayLocal: vi.fn(async () => ({ ok: true }))
}));

import { hasConstitutionalGoScope } from "../../../src/main/shikishima-full-autonomy/constitutional-go-state";
import { stackchanSayLocal } from "../../../src/main/stackchan-local-service";
import { guardedStackchanSayLocal } from "../../../src/main/stackchan-guarded-bridge";

describe("guardedStackchanSayLocal", () => {
  const root = "/proj";

  beforeEach(() => {
    vi.mocked(hasConstitutionalGoScope).mockReturnValue(true);
    vi.mocked(stackchanSayLocal).mockResolvedValue({ ok: true });
    delete process.env.SHIKISHIMA_STACKCHAN_HOLD;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("skips when HOLD env set", async () => {
    process.env.SHIKISHIMA_STACKCHAN_HOLD = "1";
    const r = await guardedStackchanSayLocal("hello", root);
    expect(r.skipped).toBe("stackchan_hold");
    expect(stackchanSayLocal).not.toHaveBeenCalled();
  });

  it("blocks without constitutional scope", async () => {
    vi.mocked(hasConstitutionalGoScope).mockReturnValue(false);
    const r = await guardedStackchanSayLocal("hello", root);
    expect(r.error).toBe("constitutional_stackchan_voice_required");
    expect(stackchanSayLocal).not.toHaveBeenCalled();
  });

  it("delegates to stackchanSayLocal when allowed", async () => {
    const r = await guardedStackchanSayLocal("hello", root);
    expect(r.ok).toBe(true);
    expect(stackchanSayLocal).toHaveBeenCalledWith("hello");
    expect(hasConstitutionalGoScope).toHaveBeenCalledWith("stackchan_voice", root);
  });
});

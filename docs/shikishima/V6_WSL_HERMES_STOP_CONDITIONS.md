# Shikishima v6 WSL / Hermes STOP Conditions — v2.8.3

## Purpose

All STOP conditions for v6 WSL and Hermes execution.

- documentVersion: v2.8.3 / decision: HOLD / execution: disabled / productionReady: false

---

## Universal STOP (applies to all v6 execution)

| Condition | Severity | Immediate Action |
|---|---|---|
| Raw value (path/secret) in output | P0 | Kill process; redact; report |
| External network connection | P0 | Kill; disconnect network if needed; report |
| RunPod endpoint contacted | P0 | Kill; report; return to HOLD |
| Process does not exit within timeout | P1 | Kill; report timeout |
| Human requests stop | Immediate | No argument; stop |

---

## WSL-Specific STOP Conditions (G-11)

| Condition | Action |
|---|---|
| WSL distribution not found | Report: "WSL distro not available"; HOLD G-11 |
| WSL output > expected size | Pause; review before continuing |
| WSL creates persistent files | Investigate; clean up; report |
| wsl hangs | `wsl --terminate [distro]`; report |

---

## Hermes-Specific STOP Conditions (G-12)

| Condition | Action |
|---|---|
| Hermes binary not found | Report: "Hermes not installed"; HOLD G-12 |
| Hermes contacts external API | P0: kill; report |
| Hermes response contains secrets | P0: kill; redact; report |
| Hermes does not exit within 120s | Kill; report timeout |
| Response schema invalid | HOLD; investigate |

---

## Timeout Values

| Process | Timeout |
|---|---|
| Dummy process | 30 seconds |
| Wrapper | 30 seconds |
| WSL command | 60 seconds |
| Hermes response | 120 seconds |

---

## Emergency Stop Commands (documentation; use only when needed)

```
# Kill WSL distribution (replace [distro] with name at time of run)
wsl --terminate [distro]

# Shutdown all WSL
wsl --shutdown

# Kill specific process by PID (Windows)
taskkill /PID [pid] /F
```

この範囲では問題を検出していません。

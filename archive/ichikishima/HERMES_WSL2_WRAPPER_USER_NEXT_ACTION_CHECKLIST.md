# Hermes WSL2 Wrapper User Next Action Checklist

Status: user local fill-in preparation only

This checklist is for the human local-only value fill-in step before a separate validator Goal. It must not be used to run WSL, start Hermes, execute the wrapper, or share raw local values.

## Checklist

1. Open `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.example.json`.
2. Copy it locally to `sandbox/hermes-autonomy-zone/local-only/wsl-wrapper-values.local.json`.
3. Confirm `wsl-wrapper-values.local.json` remains gitignored, and do not stage or commit it.
4. Fill in `distroName` with the local WSL distribution name.
5. Fill in `unixUser` with the local WSL user name.
6. Fill in `wrapperPath` as a POSIX absolute path, currently expected to be `/home/<unixUser>/.hermes-bridge/hermes-bridge-payload-once.sh`.
7. Set `windowsWslExePath` to the V1 exact Windows path: `C:\Windows\System32\wsl.exe`.
8. Do not use `Sysnative` for V1. It remains a future candidate only.
9. Confirm `allowedExecutableId` remains `wsl-hermes-bridge-wrapper-v1`.
10. Confirm `expectedPayloadSchemaVersion` remains `hermes-bridge-payload/v1`.
11. Keep signoff information redacted only. Repo docs may store summaries, not raw local values.
12. Do not paste raw local JSON, distro names, Unix user names, wrapper paths, argv, stdout/stderr, secrets, or local environment details into Codex, ChatGPT, reports, or commits.
13. After fill-in, use a separate Goal for validator and redacted summary generation.
14. Do not run `wsl.exe` in this step.
15. Do not start real Hermes in this step.
16. Do not execute the wrapper in this step.

## Stop Gate

Stop and request a separate explicit Goal before any of the following:

- Running `wsl.exe`
- Starting real Hermes
- Running real `execFile`, `spawn`, `exec`, or `child_process`
- Creating or placing files inside WSL from Windows automation
- Reading the local value JSON through validator
- Setting `productionReady:true`
- Setting `pendingPackagingResolution:false`


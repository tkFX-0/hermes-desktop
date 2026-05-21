# SC-CAM-01 Camera Comment One-shot GO Form

date: 2026-05-21
status: DRAFT / NOT APPROVED / DEFERRED
decision: HOLD
execution: disabled
productionReady: false
rawValuesReported: false

This form is a draft for one AI comment about one human-approved StackChan
camera still image. It is not approval.

Current readiness:

```text
ready_for_human_go_review: deferred
recommended_route: Route A
reason: human-provided one still image avoids continuous monitoring
priority: after SC-AI voice route is settled
```

## Required Human Fields

```text
time_window:
route_selected: A / B / C
image_source:
user_privacy_confirmation:
exact_question_to_ai:
evidence_file:
```

Default question:

```text
この1枚の画像を見て、安全に一般的な感想を一文で述べてください。個人情報や人物特定はしないでください。
```

## Allowed If Approved Later

- one still image
- one AI comment
- no identity recognition
- no continuous monitoring
- no recording
- user privacy confirmation required before analysis

## Forbidden

- face identification
- private data reading
- continuous camera monitoring
- cloud upload without GO
- motion / dance
- microphone
- firmware write
- productionReady true
- execution enabled

## STOP Conditions

- person/face/private data is visible and not approved
- continuous stream is required
- camera turns into monitoring mode
- AI attempts identity recognition
- external upload/API starts without GO
- raw token/secret/local-only value appears

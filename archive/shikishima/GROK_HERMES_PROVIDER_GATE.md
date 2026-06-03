# Grok-Hermes Provider Gate Registry

## Gate Policy

Each gate must be passed in order.
No gate auto-activates the next.
Each gate requires separate explicit human GO.
STOP conditions halt all progress until human reviews.

---

## GHG-00 — Docs-Only Research

```
objective:
  Record official Grok-Hermes integration findings and implications.
  No installation, no auth, no runtime.

allowed_actions:
  - Read official docs and announcements (browser/search)
  - Write docs/shikishima research docs
  - Commit docs

forbidden_actions:
  - hermes (any subcommand)
  - hermes auth add xai-oauth
  - OAuth login
  - browser auth flow
  - npm install / npx
  - source code change
  - runtime start
  - token read/print

required_human_GO:
  none — docs-only research is permitted without GO

STOP_conditions:
  - Any token or credential appears in output
  - Any Hermes command is run

evidence_required:
  - GROK_HERMES_PROVIDER_ARCHITECTURE_REVIEW.md
  - GROK_HERMES_PROVIDER_GATE.md
  - GROK_HERMES_TOKEN_AND_AUTH_BOUNDARY.md
  - GROK_HERMES_TOOL_HOLD_REGISTRY.md
  - PROVIDER_ROUTER_UPDATED_DESIGN.md

status:  COMPLETE (this document records GHG-00 completion)
```

---

## GHG-01 — Local Hermes Version / Readiness Check

```
objective:
  Verify Hermes is installed and confirm version/CLI readiness.
  Redacted output only. No auth. No model call.

allowed_actions:
  - hermes --version (output version string only)
  - hermes --help (help text only)
  - Which hermes (path only)

forbidden_actions:
  - hermes auth add (any provider)
  - hermes model / hermes chat
  - hermes tools
  - OAuth login
  - npm install / npx
  - source code change
  - runtime start

required_human_GO:
  Explicit human GO: "GHG-01 GO"

STOP_conditions:
  - Hermes not found / not installed
  - Version indicates incompatibility with xai-oauth provider
  - Any token or credential appears in output

evidence_required:
  - Hermes version string (redacted path if needed)
  - Confirmation: xai-oauth provider is supported in this version
  - Confirmation: hermes --help shows auth subcommand

status:  HOLD
```

---

## GHG-02 — Auth Boundary Review

```
objective:
  Review auth.json path, permissions, and gitignore status.
  Confirm token storage boundary before performing OAuth.
  No OAuth yet.

allowed_actions:
  - Check if ~/.hermes/ directory exists (ls only)
  - Check .gitignore includes *.hermes or auth.json patterns
  - Check file permissions on ~/.hermes/ if exists

forbidden_actions:
  - hermes auth add (any provider)
  - Read contents of auth.json
  - Print any token
  - OAuth login
  - source code change

required_human_GO:
  Explicit human GO: "GHG-02 GO" (after GHG-01 PASS)

STOP_conditions:
  - ~/.hermes/ or auth.json is tracked by git
  - .gitignore does not exclude auth.json
  - Permissions on auth.json are too open (world-readable)
  - Any raw token appears in output

evidence_required:
  - Confirmation: auth.json not tracked by git
  - Confirmation: .gitignore excludes auth material
  - Confirmation: directory permissions acceptable

status:  HOLD — requires GHG-01 PASS first
```

---

## GHG-03 — Manual OAuth Login GO

```
objective:
  Human performs browser OAuth login for xai-oauth provider.
  ClaudeCode does NOT trigger or automate this.

allowed_actions:
  - Human runs: hermes auth add xai-oauth (in their own terminal)
  - Human confirms browser redirect to accounts.x.ai
  - Human confirms auth.json created at ~/.hermes/auth.json
  - Human reports: auth_status=configured (no raw token)

forbidden_actions (for ClaudeCode):
  - ClaudeCode MUST NOT run hermes auth add
  - ClaudeCode MUST NOT trigger browser open
  - ClaudeCode MUST NOT read auth.json
  - ClaudeCode MUST NOT print token

required_human_GO:
  Explicit human GO: "GHG-03 GO" with time_window
  Human must perform login themselves.

STOP_conditions:
  - ClaudeCode runs hermes auth add automatically
  - Raw token appears in any output
  - auth.json becomes git-tracked

evidence_required:
  - Human confirms auth_status: configured
  - Human confirms token_present: [redacted boolean]
  - Human confirms subscription_tier: [verified name]

status:  HOLD — requires GHG-02 PASS first
```

---

## GHG-04 — Redacted Provider Status Only

```
objective:
  Verify xai-oauth provider appears in Hermes provider list.
  Redacted output only. No model call. No chat.

allowed_actions:
  - hermes provider list (or equivalent status command)
  - Record redacted output: provider=xai-oauth, auth_status=configured

forbidden_actions:
  - hermes chat / hermes model (no model call yet)
  - Print raw token
  - hermes tools
  - source code change

required_human_GO:
  Explicit human GO: "GHG-04 GO" (after GHG-03 PASS)

STOP_conditions:
  - Provider not found in list
  - auth_status is expired or revoked
  - Any raw token in output

evidence_required:
  - Redacted provider status entry for xai-oauth
  - Human confirms subscription_tier matches expected

status:  HOLD — requires GHG-03 PASS first
```

---

## GHG-05 — Chat-Only Dry Run

```
objective:
  Single safe conversation message via Hermes xai-oauth provider.
  Confirm chat works. No tool use. No x_search. No TTS. No external action.

allowed_actions:
  - Single chat message: "Hello, respond with 'OK' only"
  - Record: response received, provider=xai-oauth confirmed
  - Redact any model-internal metadata if sensitive

forbidden_actions:
  - Multi-turn conversation (single message only in dry run)
  - hermes tools / x_search
  - TTS / image / video / transcription
  - Any external write
  - hermes with --tui
  - source code change

required_human_GO:
  Explicit human GO: "GHG-05 GO" with time_window
  Human must be present during dry run.

STOP_conditions:
  - Response contains raw user data or credentials
  - Any external action triggered
  - x_search activated
  - Any tool called without explicit approval

evidence_required:
  - Chat response received
  - Provider confirmed: xai-oauth
  - No tool activation
  - Human confirms: no unexpected external request

status:  HOLD — requires GHG-04 PASS first
```

---

## GHG-06 — Shikishima Provider-Router Integration

```
objective:
  Integrate xai-oauth as primary provider in Shikishima provider-router.
  Source code change allowed in this gate only.

allowed_actions:
  - Modify provider routing config (source file, defined scope)
  - typecheck / vitest
  - Commit (no push until human GO)

forbidden_actions:
  - Enable tool use in routing (tools remain HOLD)
  - Enable x_search in routing
  - Enable autonomous actions
  - Push without separate GO

required_human_GO:
  Explicit human GO: "GHG-06 implementation GO" (after GHG-05 PASS)
  Separate push GO after implementation

STOP_conditions:
  - Source change introduces external write path
  - Tool activation in routing
  - typecheck failure
  - vitest failure

evidence_required:
  - Implementation commit hash
  - typecheck PASS
  - vitest PASS
  - Human runtime recheck

status:  HOLD — requires GHG-05 PASS first
```

---

## GHG-07 — Fallback / Quota / Timeout Policy

```
objective:
  Define and implement fallback behavior when xai-oauth is unavailable.

allowed_actions:
  - Define fallback routing rules (docs + source)
  - Implement: provider unavailable → Gemini fallback or defer
  - Implement: quota/rate limit → fallback or human prompt

forbidden_actions:
  - Auto-escalation to paid tier without human confirmation
  - Autonomous retry loop without bound

required_human_GO:
  Explicit human GO: "GHG-07 GO" (after GHG-06 PASS)

status:  HOLD — requires GHG-06 PASS first
```

---

## GHG-08 — Limited Manual Operation Use

```
objective:
  Begin limited manual operation with Grok-Hermes as primary conversation provider.
  Chat-only. No tool use beyond explicitly approved list.

allowed_actions:
  - Ordinary Shikishima conversation via Hermes xai-oauth
  - Approved tool list only (defined at gate time)

forbidden_actions:
  - x_search (requires separate GHG-09 review)
  - TTS, image, video, transcription (separate gates)
  - Autonomous external write
  - productionReady change

required_human_GO:
  Explicit human GO: "GHG-08 GO" with time_window
  Same GO discipline as existing Level 3-A operation

status:  HOLD — requires GHG-07 PASS first
```

---

## GHG-09 — Tool Expansion Review

```
objective:
  Review and selectively enable tools beyond chat-only.
  Each tool family requires individual sub-gate.

sub_gates:
  - GHG-09a: x_search review (still HOLD by default)
  - GHG-09b: TTS review
  - GHG-09c: Image generation review
  - GHG-09d: Video generation review (HOLD — off by default in Hermes)
  - GHG-09e: Transcription review
  - GHG-09f: X posting / messaging adapters

required_human_GO:
  Separate explicit GO for each sub-gate.

status:  HOLD — requires GHG-08 PASS first; each sub-gate is independent
```

---

_Created: 2026-05-18_
_productionReady: false_
_execution: disabled_

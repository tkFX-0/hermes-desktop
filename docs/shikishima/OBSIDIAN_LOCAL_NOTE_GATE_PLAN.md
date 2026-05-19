# OBS-LOCAL Obsidian Local Note Gate Plan

## Purpose

OBS-LOCAL defines a future gate for local Obsidian Markdown note read/write.

This document does not approve Obsidian writes. It only records the future gate.

## Default Status

Obsidian local note read/write is HOLD / NEEDS_HUMAN by default.

It is not permanently forbidden because it supports human review, planning notes, and evidence logging.

## Allowed Future Local-Only Actions

With explicit human GO, AI may:

- create a Markdown note in a specified local Vault path
- update a specified local note
- read a specified local note
- append evidence or instruction log

## Separately Gated

These remain separate gates:

- Obsidian Sync
- external API
- cloud write
- plugin-based network action
- raw secret/token/local value output

## Required Obsidian GO Fields

```yaml
obsidian_go:
  vault_path_scope:
  target_folder:
  target_file_or_naming_rule:
  allowed_content:
  raw_secret_exclusion:
  sync_api_status:
  evidence_requirement:
```

## Raw Secret Exclusion

Obsidian notes must not include:

- raw token
- secret
- credential
- raw local-only value
- unredacted local path unless explicitly approved for that note

## Human Review Flow

1. Human chooses the Vault scope and file target.
2. AI writes or appends only the approved Markdown content.
3. AI reports the changed file and summary.
4. Human reviews before any sync/cloud/API action.

## Plain-Language Rule

Obsidianへ記録を書くことは将来GO対象。

ただし、書く場所・内容・秘密情報を書かないことを人間が指定する。

## Safety Boundary

- local Markdown only
- sync/API: HOLD
- external network: HOLD
- raw secrets: forbidden
- productionReady: false
- execution: disabled

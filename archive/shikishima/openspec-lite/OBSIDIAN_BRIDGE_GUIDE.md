# Obsidian Bridge Guide

This guide explains how to use OpenSpec-Lite notes as Obsidian-ready Markdown without directly modifying any Obsidian Vault from the repository.

## Principle

Use one task, one note. Keep the note redacted, portable, and safe to copy manually.

The starting workflow is:

1. GPT drafts or refines a Lite note.
2. The human checks that it does not include raw values, local paths, secrets, or tokens.
3. Codex uses the Lite note as the work map.
4. The final result is copied back into the note.
5. The human manually places the redacted note in an Obsidian Inbox if desired.

## Example Note Names

- `2026-05-13_G-05_BatchA_ESLint.md`
- `2026-05-13_OpenSpec-Lite_導入.md`
- `2026-05-13_Codex指示ログ.md`

## How To Use

1. Copy a template from `templates/`.
2. Fill it with slot IDs, counts, enums, commit hashes, and safe status labels only.
3. Do not include raw values, secrets, local-only values, local paths, screenshots, or private account/device details.
4. Do not guess or discover the Obsidian Vault path.
5. Paste manually into an Obsidian Inbox if desired.
6. Do not automate direct Vault writes until a separate human approval exists.

## Not Yet Adopted

- direct Obsidian Vault automation
- auto-editing existing notes
- repo-to-Vault sync
- external search integration
- raw local configuration capture
- Local REST API automation
- direct Vault path discovery
- Cloudflare sync

## Future Semi-Automation Candidates

These remain HOLD until separately approved:

- Codex saving to a human-specified Inbox path
- PowerShell clipboard export of a redacted note
- Local REST API integration
- repo-to-Vault sync

Local REST API is powerful and must remain HOLD until the safety gate and human approval scope are explicit.

## Safe Fields

- task name
- date
- decision state
- G-number
- files by repository-relative path when safe for repo docs
- commit hash
- scoped command name without raw output
- PASS/HOLD/NG status
- redacted final report summary

## Forbidden Fields

- raw values
- secrets or tokens
- local-only file contents
- local machine paths
- raw stdout/stderr full text
- raw argv
- screenshots containing private values
- private device/account details

# Obsidian Bridge Guide

This guide explains how to use OpenSpec-Lite notes as Obsidian-ready Markdown without directly modifying any Obsidian Vault from the repository.

## Principle

Use one task, one note. Keep the note redacted, portable, and safe to copy manually.

## Example Note Names

- `2026-05-13_G-05_BatchA_ESLint.md`
- `2026-05-13_OpenSpec-Lite_導入.md`
- `2026-05-13_Codex指示ログ.md`

## How To Use

1. Copy a template from `templates/`.
2. Fill it with slot IDs, counts, enums, commit hashes, and safe status labels only.
3. Do not include raw values, secrets, local-only values, local paths, screenshots, or private account/device details.
4. Paste manually into Obsidian if desired.
5. Do not automate direct Vault writes until a separate human approval exists.

## Not Yet Adopted

- direct Obsidian Vault automation
- auto-editing existing notes
- repo-to-Vault sync
- external search integration
- raw local configuration capture

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

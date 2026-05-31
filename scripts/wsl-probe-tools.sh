#!/usr/bin/env bash
set -eu
echo -n '{"tools":{'
first=1
for c in claude hermes cursor agent codex openai node npm; do
  if [ "$first" -eq 0 ]; then echo -n ','; fi
  first=0
  path=$(command -v "$c" 2>/dev/null || true)
  if [ -n "$path" ]; then
    ver=$("$c" --version 2>/dev/null | head -1 | tr -d '\n' || true)
    printf '"%s":{"present":true,"path":"%s","version":"%s"}' "$c" "$path" "$ver"
  else
    printf '"%s":{"present":false}' "$c"
  fi
done
echo -n '},"login_shell_ok":true}'

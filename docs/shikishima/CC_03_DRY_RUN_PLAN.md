# CC-03 Dry-Run Plan

status: DRY_RUN_ONLY
productionReady: false
execution: disabled
rawValuesReported: false

Dry-run rules:

- no Command Chat send
- no Hermes/WSL
- no external API
- no token read
- no retry loop

Checks:

- exact message is present
- evidence path exists
- stop conditions are concrete
- gate restore plan exists
- no ambiguous target


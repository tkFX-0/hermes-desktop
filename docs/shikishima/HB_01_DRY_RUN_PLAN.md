# HB-01 Dry-Run Plan

status: DRY_RUN_ONLY
productionReady: false
execution: disabled
rawValuesReported: false

Dry-run rules:

- no Hermes/WSL connection
- no bridge process
- no runtime
- no external API
- no retry loop

Checks:

- command field is explicit
- shutdown method is explicit
- evidence path exists
- stop conditions are concrete
- gate restore plan exists


# つむぎ Safe Patch Checklist

## Before Editing

- [ ] The task has a clear scope.
- [ ] The task is not execution approval.
- [ ] The task does not require raw values.
- [ ] Files outside scope are identified and avoided.
- [ ] しずめ review is required for boundary-crossing work.

## During Editing

- [ ] Do not introduce WSL, Hermes, wrapper, dummy, RunPod, robot, install, or network paths.
- [ ] Do not add arbitrary command or argv execution.
- [ ] Do not add execution buttons or command inputs.
- [ ] Do not write raw values into tracked files.
- [ ] Keep decision as HOLD unless the human explicitly approves another state.

## Verification

- [ ] Run static checks appropriate to the task.
- [ ] Confirm no forbidden phrase is introduced.
- [ ] Confirm rawValuesReported remains false.
- [ ] Confirm execution remains disabled.
- [ ] Confirm productionReady remains false.

## Commit and Push

- [ ] Commit only if verification passes and commit is in scope.
- [ ] Stage only intended files.
- [ ] Push only with separate explicit human approval.

この範囲では問題を検出していません。

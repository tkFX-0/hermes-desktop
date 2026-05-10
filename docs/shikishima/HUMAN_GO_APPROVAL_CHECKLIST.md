# Human GO Approval Checklist

## Purpose

This checklist defines what a future explicit human GO must contain. It does not
grant GO by itself.

## Required Fields

- [ ] Exact action approved.
- [ ] Time window.
- [ ] Allowed command or non-command action.
- [ ] Forbidden adjacent actions.
- [ ] Rollback or stop condition.
- [ ] Logging expectation.
- [ ] Raw value boundary.
- [ ] Push status if git is involved.
- [ ] productionReady remains false unless explicitly reviewed.

## Invalid Approval

- broad "do everything" approval.
- implicit approval from docs completion.
- approval inferred from commit permission.
- approval inferred from slot or packaging readiness.

この範囲では問題を検出していません。

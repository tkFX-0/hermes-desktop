# Change Tasks Template

## Docs-Only Tasks

- [ ] task:

## Code Tasks After GO

- [ ] task:
- required GO:

## Command Tasks After GO

- [ ] task:
- command:
- required GO:

## Verification Tasks

- [ ] task:
- allowed command:
- forbidden command:

## Commit Tasks

- [ ] check staged files
- [ ] stage only allowed files
- [ ] inspect staged diff
- [ ] commit with approved subject
- [ ] confirm push not performed

## STOP Conditions

- [ ] unexpected staged files
- [ ] unexpected dirty files in scope
- [ ] command failure without clear exit code
- [ ] raw values would be exposed
- [ ] package/source/test/docs boundary would be crossed
- [ ] human approval needed

## Final Report Format

1. Overall status
2. Files changed
3. Verification result
4. Commit status
5. Git status
6. Safety boundary confirmation
7. Remaining HOLD reason
8. Next required human action

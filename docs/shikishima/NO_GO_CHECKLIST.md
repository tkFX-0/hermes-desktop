# NO-GO Checklist

## Use This Checklist When

- risk is unclear.
- approval is missing or too broad.
- raw values may leak.
- execution boundary may be crossed.
- rollback is unclear.

## NO-GO Conditions

- [ ] raw local-only value output.
- [ ] credential exposure.
- [ ] WSL, Hermes, wrapper, RunPod, robot, install, network, packaged smoke, or git push without separate approval.
- [ ] productionReady true requested without full approval.
- [ ] autonomous operation or robot motion.
- [ ] command or argv is arbitrary.

## Result

If any item is true, the decision remains HOLD or REJECT according to しずめ.

この範囲では問題を検出していません。

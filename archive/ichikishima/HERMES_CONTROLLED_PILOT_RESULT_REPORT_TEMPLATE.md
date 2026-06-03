# Hermes Controlled Pilot — 結果レポートテンプレート（短文メタのみ）

実機単発実施後、**短文メタのみ**記入する。**stdout/stderr 全文や raw payload は記載しない**（保存もしない）。

**前提**: Windows／NousResearch 本流では **WSL2 + `wsl.exe` 経路**があり得る（`ADR_REAL_HERMES_WSL2_CONNECTION.md`）。**allowedExecutableId** に **`wsl-...`** を含む場合は **実行口が広い**ことを記録に一段書く（人手）。

**補助**: `hermes-wsl2-wrapper-parameter-registry.ts` で **論理検証のみ**（**実起動なし**）。**値確認テンプレ**: `HERMES_WSL2_WRAPPER_VALUE_CONFIRMATION.md`。**Human value packet**: `HERMES_WSL2_WRAPPER_HUMAN_VALUE_PACKET.md`、`hermes-wsl2-wrapper-human-value-packet.ts`。**dummy `.sh.sample`** は **自動配置・実行しない**。

1. **実施日時**（UTC 推奨）:  
2. **allowedExecutableId**:  
3. **argvPattern**（固定配列をラベル化した短文）:  
4. **timeoutMs / maxStdoutBytes / maxStderrBytes**:  
5. **stdoutBytes**（数字のみ）:  
6. **stderrBytes**（数字のみ）:  
7. **exitCode**:  
8. **signalBrief**（短文のみ）:  
9. **payloadValidationStatus**（success / rejected + reason codes 短文）:  
10. **receiverQueueStatus**（短文）:  
11. **minimalPipelineStatus**（短文）:  
12. **approval / audit / review / report** — キュー短文・件数のみ:  
13. **process remained after run?** — `no` 必須:  
14. **stdout/stderr 全文を保存していないことを確認したか** — `yes`/`no`:  
15. **raw payload 全文を保存していないことを確認したか** — `yes`/`no`:  
16. **本番 READY として扱わないことを確認したか** — `yes` 必須:  
17. **次判断**（Controlled Pilot 再試行／仕様確認／別 Goal）:

**stdout/stderr 全文を転記する欄は設けない**。env 転記ブロックも設けない。

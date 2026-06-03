# パッケージ版 準備完了ガイド

## 現在の状態

```text
実行可能な状態: YES
日本語UI: YES (ロケール: ja)
StackChan接続: デバイス到着後にIPを設定するだけ
CI/CD: GitHub pushで自動実行
```

## 「開いて」手順

### 即時起動 (現在)

```powershell
cd "[repo-root]"
.\node_modules\.bin\electron.cmd .
```

日本語UIで起動します。

### 言語切り替え

1. アプリを起動
2. Settings（設定）画面へ
3. Appearance（外観）セクション → Language → 「日本語」をクリック
4. 即時反映・再起動不要

### Windowsインストーラー作成 (要管理者権限)

```powershell
# 管理者として実行、またはDeveloper Mode有効化後:
cd "[repo-root]"
npm run build:win
# → dist/shikishima-desktop-0.2.3-setup.exe が生成される
```

**Developer Mode の有効化:**
設定 → システム → 開発者向け → 開発者モード: ON

---

## StackChan 接続手順 (デバイス到着後)

1. `src/main/ichikishima/stackchan/stackchan-config.ts` を開く
2. `wifiIp` を実際のIPアドレスに変更
3. `enabled: true` に変更
4. `npm run build` を実行
5. アプリを起動 → 表情のみモードで接続テスト

```typescript
// stackchan-config.ts の変更箇所:
export const STACKCHAN_DEFAULT_CONFIG: StackChanConfig = {
  enabled: true,          // false → true
  connectionMode: "wifi",  // "none" → "wifi"
  wifiIp: "192.168.x.x",  // 実際のIPに変更
  wifiPort: 8080,
  expressionOnly: true,    // 表情のみ (モーションはHOLD)
  motionEnabled: false,    // motion は別途承認が必要
};
```

---

## 音声 (VOICEVOX) 有効化手順

1. VOICEVOX をローカルにインストール・起動 (http://localhost:50021)
2. `src/main/ichikishima/voice/voice-config.ts` を変更:

```typescript
export const VOICE_DEFAULT_CONFIG: VoiceConfig = {
  status: "approved",        // "not_approved" → "approved"
  ttsProvider: "voicevox",   // "none" → "voicevox"
  ttsEnabled: true,          // false → true
  userTriggeredOnly: true,   // 必ずtrue維持
};
```

3. `npm run build` を実行

---

## Level 3 有効化手順 (人間GO必須)

Level 3 は以下の条件が揃ったときのみ:
1. B3 clean PASS 5/5 完了・acceptance記録済み
2. Human Review Decision Sheet 承認済み
3. 明示的なLevel 3 GO文面 (time_window + session ID付き)

```typescript
// level3-config.ts の有効化は GO受領後のみ:
const myConfig: Level3Config = {
  status: "go_issued",
  approvedBy: "human_reviewer",
  approvedAt: "YYYY-MM-DDTHH:MM:SSZ",
  sessionId: "shikishima-level3-session-001",
  timeWindow: { start: "...", end: "..." },
  allowedCommands: [...],
};
```

---

## 完成状況チェックリスト

```text
✓ 日本語UI (ja 20ネームスペース)
✓ 言語切り替えUI (Settings画面)
✓ StackChan接続コード (デバイス待ち)
✓ Level 3 スキャフォルド
✓ 音声 (VOICEVOX) スキャフォルド
✓ GitHub Actions CI/CD
✓ typecheck: 0 errors
✓ test: 712/712 pass
✓ build: success

□ B3 Session-009 clean PASS #5 (人間観察セッション)
□ Windowsインストーラー (管理者権限 or Developer Mode必要)
□ Level 3 GO (人間承認)
□ StackChan物理接続 (デバイス到着待ち)
□ 音声有効化 (VOICEVOX別途インストール)
```

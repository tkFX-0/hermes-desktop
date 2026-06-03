# Chisiki（チシキ）— 平易説明ブリーフ

Date: 2026-05-30  
調査担当: しるべ（一次資料） / しずめ（安全） / はじめ（適合マップ）  
**オンチェーン接続・自動支払い: しきしまでは実施していません（HOLD）**

## 1. Chisiki とは

**Chisiki（チシキ）** は、ブロックチェーン上で動く **「知識・エージェント」向けのプロトコル** です。

- 比喩: **メーター付きの高速道路** — 誰でも走れるが、走るたびに **通行料（ガス代）** がかかる設計になりやすい
- 公式: https://chisiki.io/
- エクスプローラ（取引の閲覧）: https://chisiki.io/explorer/

しきしま（Hermes Desktop）の **Discord Bot・StackChan・自律 tick** とは **別レイヤ** です。今のしきしまは **あなたの PC 上** で動き、Discord は **REST 返信**、StackChan は **ローカル Wi‑Fi + VOICEVOX** です。

## 2. CKT とは

**CKT** は Chisiki ネットワークで使う **プロトコルトークン** です。

- 比喩: **ガソリンスタンドのプリペイドカードの通貨単位**
- 用途（一般論）: スマートコントラクト実行・API 呼び出しなどの **手数料（ガス）** を支払う
- **投資・FX・しきしまの EA とは無関係**（別物）

## 3. gasvault（Chisiki Gas Vault）とは

リポジトリ: https://github.com/Chisiki1/chisiki-gasvault

- 比喩: **先払いのガス代ウォレット** — まとめてチャージし、エージェントやツールがガスを消費
- **メリット（設計思想）**: 都度ウォレットを触らずに済む、上限を設けやすい
- **リスク**: 秘密鍵の保管、誤送金、コントラクトバグ、トークン価格変動、**自動引き落とし**

解説 note（参考）: https://note.com/chisiki/n/n05f67f31d215

## 4. chisiki-sdk とは

リポジトリ: https://github.com/Chisiki1/chisiki-sdk

- Chisiki プロトコル用 **開発者向け SDK**
- しきしまに **そのまま組み込むと** Node 依存・RPC・ウォレット・署名が絡む → **別 GO が必要**

## 5. しきしまとの関係（重要）

| しきしまの今 | Chisiki |
|-------------|---------|
| ローカル Bot・憲法 HOLD | オンチェーン・トークン経済 |
| `SHIKISHIMA_BILLING_MODE=subscription_only` | CKT でガス精算 |
| 秘密鍵・`.env` 触らない方針 | ウォレット鍵が必須になりうる |

**結論（しずめ推奨）**: 当面は **採用レベル A（思想のみ）** — 既存の課金枠・上限のドキュメント強化。詳細は [CHISIKI_GASVAULT_ADOPTION_CANDIDATES.md](CHISIKI_GASVAULT_ADOPTION_CANDIDATES.md)。

## 6. あなたへの相談（選んでください）

[HUMAN_GO_QUESTIONNAIRE_2026-05-30.md](../HUMAN_GO_QUESTIONNAIRE_2026-05-30.md) を参照。

1. **CKT / オンチェーン**: A 触らない / B 将来検討 / C 本番接続
2. **StackChan 音声**: 今すぐ resume + 聴感 / HOLD 継続

## 調査ソース一覧

| ソース | URL | 取得日 |
|--------|-----|--------|
| 公式 | https://chisiki.io/ | 2026-05-30 |
| Explorer | https://chisiki.io/explorer/ | 2026-05-30 |
| SDK | https://github.com/Chisiki1/chisiki-sdk | 2026-05-30 |
| note | https://note.com/chisiki/n/n05f67f31d215 | 2026-05-30 |
| gasvault | https://github.com/Chisiki1/chisiki-gasvault | 2026-05-30 |

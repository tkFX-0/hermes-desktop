/**
 * Control Center localhost read-only HTTP の公開契約。
 * Threat Model / Contract 文書と同一のソース・オブ・トゥルース。
 * 最小実装: `local-api-server.ts`（`GET /snapshot`・`127.0.0.1` のみ）。
 */

import type { ControlCenterReadonlyData } from "./control-center-data-provider";

/** 実装フェーズでの bind に使う許可ホストのみ（Threat Model と一致）。 */
export const CONTROL_CENTER_LOCAL_API_BIND_LOOPBACK_IPV4 = "127.0.0.1" as const;

/** V1 HTTP で許可されるメソッド（read-only Snapshot の転送のみ）。 */
export type ControlCenterLocalApiAllowedHttpMethod = "GET";

/** V1 で公開する論理経路は 1 本のみ（メソッド + パス）。 */
export const CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1 = [
  { method: "GET", path: "/snapshot" },
] as const;

export type ControlCenterLocalApiAllowedRoute =
  (typeof CONTROL_CENTER_LOCAL_API_ALLOWED_ROUTES_V1)[number];

/** V1 で `GET /snapshot` として受け付けない HTTP メソッド（同一パスの HEAD・OPTIONS は 405）。 */
export const CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS = [
  "HEAD",
  "OPTIONS",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "CONNECT",
  "TRACE",
] as const;

export type ControlCenterLocalApiForbiddenHttpMethod =
  (typeof CONTROL_CENTER_LOCAL_API_FORBIDDEN_HTTP_METHODS)[number];

/** V1: CORS 許可リストは空。**Access-Control-Allow-Origin は送出しない**。 */
export const CONTROL_CENTER_LOCAL_API_CORS_ORIGINS_V1_DENYLIST = [] as const;

/** 名前・RFC 準拠の禁止パス／プレフィックス類（DOCUMENT の列挙と整合）。 */
export const CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_EXAMPLES = [
  "/execute",
  "/delete",
  "/network",
  "/git",
  "/approval",
  "/approval/execute",
  "/hermes/run-raw",
  "/memory/write",
  "/mt5",
  "/env",
  "/secrets",
  "/raw-log",
] as const;

/** クエリまたはサブパスで検知すべき禁止スラッグ（ルータの deny リスト用）。 */
export const CONTROL_CENTER_LOCAL_API_FORBIDDEN_PATH_SLUGS = [
  "execute",
  "delete",
  "network",
  "git",
  "secrets",
  "raw-log",
  "run-raw",
  "approval/execute",
] as const;

/**
 * HTTP レイヤでの成功応答本体（論理）。
 * （エラー envelope は `ControlCenterLocalApiErrorEnvelope`。）
 */
export type ControlCenterLocalApiV1SuccessBody = ControlCenterReadonlyData;

/** Contract 上の読取エラー応答。**stack trace と secrets と raw を含めない**。 */
export interface ControlCenterLocalApiErrorEnvelope {
  readonly ok: false;
  readonly reasonCode: string;
  readonly reason: string;
}

export type ControlCenterLocalApiV1Response =
  | ControlCenterLocalApiV1SuccessBody
  | ControlCenterLocalApiErrorEnvelope;

/** Snapshot 応答サイズ上限の候補（実装時にハード／ソフト両方検討）。 */
export const CONTROL_CENTER_LOCAL_API_MAX_SNAPSHOT_BODY_BYTES_GUESS =
  512 * 1024;

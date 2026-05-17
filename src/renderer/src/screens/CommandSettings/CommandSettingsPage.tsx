/**
 * CommandSettingsPage — Local Command Center preferences.
 * All settings affect local device only. No cloud sync. No external write.
 * Risky capabilities are LOCKED: visually grayed, non-interactive, lock icon.
 */

import type { LocalSettingsData } from "../../types/service-contracts";
import type { LockedSetting } from "../../../../shared/ichikishima/ui-safety-types";
import { ALL_LOCKED_SETTINGS } from "../../../../shared/ichikishima/ui-safety-types";

interface CommandSettingsPageProps {
  readonly settings: LocalSettingsData;
  readonly onUpdateSetting: <K extends keyof LocalSettingsData>(
    key: K,
    value: LocalSettingsData[K],
  ) => void;
  readonly lang?: "ja" | "en";
}

const LOCKED_LABELS: Record<LockedSetting, { ja: string; en: string }> = {
  productionReady: {
    ja: "productionReady true への変更",
    en: "Change productionReady to true",
  },
  execution: {
    ja: "execution の有効化",
    en: "Enable execution",
  },
  externalWrite: {
    ja: "外部書き込みの許可",
    en: "Allow external writes",
  },
  stackChanPhysical: {
    ja: "StackChan物理操作の有効化",
    en: "Enable StackChan physical operation",
  },
  voiceCameraMic: {
    ja: "voice / camera / mic の有効化",
    en: "Enable voice / camera / mic",
  },
};

const LOCK_TOOLTIP = {
  ja: "この設定はClaudeCodeのGOが必要です",
  en: "This setting requires ClaudeCode GO",
} as const;

const SECTION: React.CSSProperties = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 8,
  padding: "14px",
  background: "var(--paper2, #f3f4f6)",
  border: "1px solid var(--rule, #e5e7eb)",
  borderRadius: 4,
};

const HEADING: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 10,
  letterSpacing: 2,
  color: "var(--ink3, #9ca3af)",
  margin: "0 0 4px",
};

interface SettingRowProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "6px 0",
        borderBottom: "1px solid var(--rule, #e5e7eb)",
      }}
    >
      <span
        style={{
          fontFamily: '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
          fontSize: 12,
          color: "var(--ink, #111827)",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

interface SelectProps {
  readonly value: string;
  readonly options: readonly { value: string; label: string }[];
  readonly onChange: (v: string) => void;
  readonly ariaLabel: string;
}

function SettingSelect({ value, options, onChange, ariaLabel }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      style={{
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: 11,
        color: "var(--ink, #111827)",
        background: "var(--paper, #ffffff)",
        border: "1px solid var(--rule, #d1d5db)",
        borderRadius: 3,
        padding: "4px 8px",
        cursor: "pointer",
        minHeight: 32,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CommandSettingsPage({
  settings,
  onUpdateSetting,
  lang = "ja",
}: CommandSettingsPageProps) {
  return (
    <div
      style={{
        padding: "18px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 700,
      }}
    >
      <div>
        <p
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: 2,
            color: "var(--ink3, #9ca3af)",
            margin: "0 0 2px",
          }}
        >
          {lang === "ja" ? "設定 · LOCAL ONLY" : "SETTINGS · LOCAL ONLY"}
        </p>
        <p
          style={{
            fontFamily:
              lang === "en"
                ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
            fontSize: 11,
            color: "var(--ink3, #9ca3af)",
            margin: 0,
          }}
        >
          {lang === "ja"
            ? "このページの設定は端末内のみで有効です。外部に送信されません。"
            : "These settings affect this device only. Nothing is sent externally."}
        </p>
      </div>

      {/* Display */}
      <div style={SECTION}>
        <p style={HEADING}>{lang === "ja" ? "表示 / 表記" : "DISPLAY / LANGUAGE"}</p>
        <SettingRow label={lang === "ja" ? "表示言語" : "Display language"}>
          <SettingSelect
            value={settings.language}
            options={[
              { value: "ja", label: "日本語" },
              { value: "en", label: "English" },
            ]}
            onChange={(v) =>
              onUpdateSetting("language", v as LocalSettingsData["language"])
            }
            ariaLabel="Display language"
          />
        </SettingRow>
        <SettingRow label={lang === "ja" ? "テーマ" : "Theme"}>
          <SettingSelect
            value={settings.theme}
            options={[
              { value: "light", label: lang === "ja" ? "ライト" : "Light" },
              { value: "dark", label: lang === "ja" ? "ダーク" : "Dark" },
              { value: "auto", label: lang === "ja" ? "自動" : "Auto" },
            ]}
            onChange={(v) =>
              onUpdateSetting("theme", v as LocalSettingsData["theme"])
            }
            ariaLabel="Theme"
          />
        </SettingRow>
      </div>

      {/* Data freshness */}
      <div style={SECTION}>
        <p style={HEADING}>{lang === "ja" ? "データ鮮度" : "DATA FRESHNESS"}</p>
        <SettingRow
          label={lang === "ja" ? "stale 警告しきい値" : "Stale threshold"}
        >
          <SettingSelect
            value={String(settings.staleThresholdSeconds)}
            options={[
              { value: "30", label: "30s" },
              { value: "60", label: "60s" },
              { value: "120", label: "120s" },
            ]}
            onChange={(v) =>
              onUpdateSetting(
                "staleThresholdSeconds",
                Number(v) as LocalSettingsData["staleThresholdSeconds"],
              )
            }
            ariaLabel="Stale threshold"
          />
        </SettingRow>
        <SettingRow
          label={lang === "ja" ? "stale 時の挙動" : "On stale behavior"}
        >
          <SettingSelect
            value={settings.onStale}
            options={[
              {
                value: "switch-to-hold",
                label: lang === "ja" ? "HOLDに切替" : "Switch to HOLD",
              },
              {
                value: "warn-only",
                label: lang === "ja" ? "警告のみ" : "Warn only",
              },
            ]}
            onChange={(v) =>
              onUpdateSetting(
                "onStale",
                v as LocalSettingsData["onStale"],
              )
            }
            ariaLabel="On stale behavior"
          />
        </SettingRow>
      </div>

      {/* Toast */}
      <div style={SECTION}>
        <p style={HEADING}>TOAST</p>
        <SettingRow label={lang === "ja" ? "toast 表示" : "Show toasts"}>
          <SettingSelect
            value={settings.toastEnabled ? "on" : "off"}
            options={[
              { value: "on", label: "ON" },
              { value: "off", label: "OFF" },
            ]}
            onChange={(v) =>
              onUpdateSetting("toastEnabled", v === "on")
            }
            ariaLabel="Toast enabled"
          />
        </SettingRow>
        <SettingRow
          label={lang === "ja" ? "toast 滞留時間" : "Toast linger"}
        >
          <SettingSelect
            value={String(settings.toastLingerSeconds)}
            options={[
              { value: "3", label: "3s" },
              { value: "5", label: "5s" },
              { value: "8", label: "8s" },
            ]}
            onChange={(v) =>
              onUpdateSetting(
                "toastLingerSeconds",
                Number(v) as LocalSettingsData["toastLingerSeconds"],
              )
            }
            ariaLabel="Toast linger"
          />
        </SettingRow>
      </div>

      {/* LOCKED capabilities */}
      <div
        style={{
          ...SECTION,
          background: "var(--paper, #ffffff)",
          border: "1px solid var(--hold, #d97706)",
        }}
      >
        <p
          style={{
            ...HEADING,
            color: "var(--hold, #d97706)",
          }}
        >
          {lang === "ja"
            ? "ロック設定 — ClaudeCode GOが必要"
            : "LOCKED SETTINGS — ClaudeCode GO required"}
        </p>
        {ALL_LOCKED_SETTINGS.map((setting) => {
          const lbl = LOCKED_LABELS[setting];
          return (
            <div
              key={setting}
              title={LOCK_TOOLTIP[lang]}
              aria-disabled="true"
              aria-label={`${lang === "ja" ? lbl.ja : lbl.en} — ${LOCK_TOOLTIP[lang]}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "var(--paper2, #f3f4f6)",
                border: "1px solid var(--rule, #e5e7eb)",
                borderRadius: 3,
                opacity: 0.65,
                cursor: "not-allowed",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
                  fontSize: 14,
                  color: "var(--hold, #d97706)",
                }}
                aria-hidden
              >
                🔒
              </span>
              <span
                style={{
                  fontFamily:
                    lang === "en"
                      ? '"IBM Plex Sans", "Inter", system-ui, sans-serif'
                      : '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif',
                  fontSize: 12,
                  color: "var(--ink3, #6b7280)",
                }}
              >
                {lang === "ja" ? lbl.ja : lbl.en}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

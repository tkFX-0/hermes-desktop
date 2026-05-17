import type { KomashikiDisplayState } from "../../../../shared/mobile-console";

const KOMASHIKI_MESSAGES: Record<KomashikiDisplayState, string> = {
  GO:             "準備OKだよ。人間GOが来たら進めるよ。",
  HOLD:           "まだ待機だよ。人間GOが必要だよ。",
  REJECT:         "却下されたよ。理由を確認してね。",
  PASS:           "証跡まで残ったよ。安全に完了！",
  STOP:           "ここで止めよう。安全確認が先だよ。",
  REVIEW_READY:   "レビュー待ちだよ。人間の確認を待っているよ。",
  PUSH_WAITING:   "pushは人間GO待ちだよ。",
  RUNTIME_RUNNING:"観察中だよ。閉じる前にiPhone確認してね。",
  CAVEAT:         "通ったけど注意あり。caveatを確認してね。",
  SLEEPY:         "アイドル中だよ。何かあれば呼んでね。",
};

const STATE_COLOR: Record<KomashikiDisplayState, string> = {
  GO:             "#3fb950",
  HOLD:           "#a371f7",
  REJECT:         "#f85149",
  PASS:           "#3fb950",
  STOP:           "#f85149",
  REVIEW_READY:   "#58a6ff",
  PUSH_WAITING:   "#d29922",
  RUNTIME_RUNNING:"#58a6ff",
  CAVEAT:         "#d29922",
  SLEEPY:         "#8b949e",
};

interface Props {
  state?: KomashikiDisplayState;
  caveats?: readonly string[];
}

const CAVEAT_DISPLAY: Record<string, string> = {
  windows_manual_installer_required_non_blocking:
    "Hermes CLIはWindowsでは手動インストールが必要です。自動インストールはしません。観察はcaveat付きで継続できます。",
};

export default function MobileKomashikiCard({ state = "HOLD", caveats }: Props): React.JSX.Element {
  const color = STATE_COLOR[state] ?? "#8b949e";
  const message = KOMASHIKI_MESSAGES[state] ?? KOMASHIKI_MESSAGES.HOLD;

  return (
    <div style={{ background: "#0d1e2e", border: "1px solid #1f4068", borderRadius: 8, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#79c0ff", marginBottom: 8 }}>
        こましき 🐾
        <span style={{ fontSize: 10, color: "#8b949e", marginLeft: 6, fontWeight: 400 }}>
          display-only / no execution
        </span>
      </div>
      <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, background: `${color}18`, border: `1px solid ${color}55`, color, borderRadius: 4, padding: "2px 8px", marginBottom: 8, fontFamily: "ui-monospace, monospace" }}>
        {state}
      </div>
      <div style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.6 }}>{message}</div>
      {caveats && caveats.length > 0 && (
        <div style={{ marginTop: 10, borderTop: "1px solid #1f4068", paddingTop: 8 }}>
          <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 4 }}>Caveat（既知注意事項）</div>
          {caveats.map((c) => (
            <div key={c} style={{ fontSize: 11, color: "#d29922", lineHeight: 1.5 }}>
              {CAVEAT_DISPLAY[c] ?? c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

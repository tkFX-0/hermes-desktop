const bannerStyle: React.CSSProperties = {
  background: "rgba(251,146,60,0.07)",
  border: "1px solid rgba(251,146,60,0.4)",
  borderRadius: 8,
  padding: "10px 14px",
  marginBottom: 12,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
  marginBottom: 3,
};

const labelStyle: React.CSSProperties = { color: "#8b949e" };
const valueStyle: React.CSSProperties = { color: "#fb923c", fontWeight: 600, fontFamily: "ui-monospace, monospace" };
const titleStyle: React.CSSProperties = { color: "#fb923c", fontSize: 12, fontWeight: 700, marginBottom: 8, letterSpacing: "0.05em" };

export default function MobileSafetyBanner(): React.JSX.Element {
  return (
    <div style={bannerStyle} role="note" aria-label="しきしま安全境界">
      <div style={titleStyle}>⚠ しきしま 安全境界</div>
      <div style={rowStyle}><span style={labelStyle}>判定</span><span style={valueStyle}>HOLD</span></div>
      <div style={rowStyle}><span style={labelStyle}>実行状態</span><span style={valueStyle}>disabled</span></div>
      <div style={rowStyle}><span style={labelStyle}>本番準備</span><span style={valueStyle}>false</span></div>
      <div style={rowStyle}><span style={labelStyle}>raw値</span><span style={valueStyle}>非表示</span></div>
      <div style={{ ...rowStyle, marginBottom: 0 }}><span style={labelStyle}>Level 3</span><span style={valueStyle}>未承認</span></div>
    </div>
  );
}

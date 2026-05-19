/**
 * PixelRoomFloor — rich CSS floor for 2.5D pixel room.
 * PXR-05C: stronger tile pattern, depth shadow, indoor feel.
 */

export function PixelRoomFloor(): React.JSX.Element {
  return (
    <>
      {/* Main floor — dark tile base */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "58%",
        zIndex: 1,
        background: "#050c18",
        backgroundImage:
          "linear-gradient(rgba(30,50,120,0.28) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(30,50,120,0.28) 1px, transparent 1px)",
        backgroundSize: "44px 30px",
      }} />

      {/* Alternating dark tile (checkerboard) */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "58%",
        zIndex: 1,
        backgroundImage: "repeating-conic-gradient(rgba(20,35,90,0.14) 0% 25%, transparent 0% 50%)",
        backgroundSize: "44px 30px",
        pointerEvents: "none",
      }} />

      {/* Wall → floor depth shadow */}
      <div aria-hidden style={{
        position: "absolute",
        top: "40%", left: 0, right: 0,
        height: 80, zIndex: 3,
        background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Front edge darkening */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 30, zIndex: 3,
        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }} />

      {/* Left vignette */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, left: 0,
        width: 90, height: "58%", zIndex: 3,
        background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Right vignette */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: 0, right: 0,
        width: 90, height: "58%", zIndex: 3,
        background: "linear-gradient(270deg, rgba(0,0,0,0.45) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Center warm glow (from overhead light) */}
      <div aria-hidden style={{
        position: "absolute",
        bottom: "8%", left: "50%",
        transform: "translateX(-50%)",
        width: "35%", height: "45%",
        zIndex: 3,
        background: "radial-gradient(ellipse, rgba(88,130,255,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
    </>
  );
}

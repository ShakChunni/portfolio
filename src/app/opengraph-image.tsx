import { ImageResponse } from "next/og";

export const alt = "F.M. Ashfaq — software engineer & applied-security researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#16181f",
          color: "#e8e9ee",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#22c55e" }} />
          <span style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#8b8d9a" }}>
            Perth · CodeXGate · Curtin University
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <h1 style={{ fontSize: 84, lineHeight: 1.04, margin: 0, maxWidth: 1000, fontWeight: 600 }}>
            I build systems for the places where{" "}
            <span style={{ fontStyle: "italic", color: "#22c55e" }}>
              software has to earn trust.
            </span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(232,233,238,0.12)", paddingTop: 28 }}>
          <span style={{ fontSize: 30, fontWeight: 600 }}>F.M. Ashfaq</span>
          <span style={{ fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#8b8d9a" }}>
            Software engineer · Applied-security researcher
          </span>
        </div>
      </div>
    ),
    size,
  );
}

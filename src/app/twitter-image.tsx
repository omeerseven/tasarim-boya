import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Tasarım Boya | Hayallerinizi Tasarlıyoruz";

function getLogoDataUri(): string {
  const filePath = path.join(process.cwd(), "public", "tasarim-boya-mark.png");
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:image/png;base64,${base64}`;
}

export default function TwitterImage() {
  const logoSrc = getLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          backgroundColor: "#081326",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #122540 0%, #081326 70%)",
        }}
      >
        <img src={logoSrc} width={200} height={200} alt="" />
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#fbf8f2",
            letterSpacing: -1,
          }}
        >
          Tasarım
          <span style={{ color: "#d4af47", marginLeft: 18 }}>Boya</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontStyle: "italic",
            color: "#eeda94",
          }}
        >
          Hayallerinizi Tasarlıyoruz
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "امیرحسین شرکائی | طراحی وب و خلاقیت دیجیتال";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

/*
 * Load Vazirmatn from a public CDN. We use fetch instead of fs
 * because this route runs on the Edge runtime, which has no filesystem.
 *
 * If the fetch fails (offline build, CDN hiccup), we fall back to a
 * Latin-only design so the OG image is never broken.
 */
async function loadFont(): Promise<ArrayBuffer | null> {
  const urls = [
    "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Bold.ttf",
    "https://raw.githubusercontent.com/rastikerdar/vazirmatn/v33.003/fonts/ttf/Vazirmatn-Bold.ttf",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (res.ok) return await res.arrayBuffer();
    } catch {
      /* try the next URL */
    }
  }

  return null;
}

export default async function OpengraphImage() {
  const fontData = await loadFont();

  /* ── Fallback: no font available (Latin-only) ── */
  if (!fontData) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px",
            background: "#f7f3ee",
            color: "#0a0908",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
              letterSpacing: 3,
              color: "#716b64",
            }}
          >
            <span>AMIRHOSSEIN SHERKAEI</span>
            <span>01 / 01</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                color: "#716b64",
                letterSpacing: 3,
              }}
            >
              WEB DESIGN / AI CREATIVE
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 96,
                lineHeight: 1.02,
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              Amirhossein Sherkaei
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 32,
                color: "#3f3a34",
              }}
            >
              Portfolio & digital experiences
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid #d6cec0",
              paddingTop: 24,
              fontSize: 20,
              color: "#716b64",
              letterSpacing: 3,
            }}
          >
            <span>PORTFOLIO / 1404</span>
            <span>DESIGN · DEVELOPMENT · AI</span>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  /* ── Full Persian design (requires Vazirmatn) ── */
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#f7f3ee",
          color: "#0a0908",
          fontFamily: "Vazirmatn",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,75,44,0.22), transparent 65%)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 3,
            color: "#716b64",
            position: "relative",
          }}
        >
          <span>AMIRHOSSEIN SHERKAEI</span>
          <span>01 / 01</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#716b64",
              letterSpacing: 1,
            }}
          >
            طراحی وب / خلاقیت دیجیتال
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.035em",
            }}
          >
            <span>امیرحسین شرکائی</span>
            <span style={{ color: "#3f3a34" }}>
              طراحی وب و خلاقیت دیجیتال
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #d6cec0",
            paddingTop: 24,
            fontSize: 20,
            color: "#716b64",
            letterSpacing: 2,
            position: "relative",
          }}
        >
          <span>PORTFOLIO / ۱۴۰۴</span>
          <span>DESIGN · DEVELOPMENT · AI</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Vazirmatn",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
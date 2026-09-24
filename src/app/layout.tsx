import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";

/* ═══════════════════════════════════════════════════════════
   CSS — Order matters! Tokens → Base → Layout → Pages → Enhancements
   ═══════════════════════════════════════════════════════════ */

import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/layout.css";
import "@/styles/layout-more.css";
import "@/styles/footer-effects.css";
import "@/styles/pages.css";
import "@/styles/responsive.css";
import "@/styles/enhancements.css";
import "@/styles/mobile-fix.css";
import "@/app/blog/blog.css";
import "@/styles/theme-toggle.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { allSchemas } from "@/lib/schema";

/* ─────────────────────────────────────────────────────────────
   VARIABLE FONT — Vazirmatn
   - No `weight` field → Next.js auto-loads variable font
   - Weight axis 100–900 available at runtime
   - Only Arabic + Latin subsets (saves ~56KB vs full)
   ───────────────────────────────────────────────────────────── */
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "arial"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://amirhossein-portfolio.vercel.app";

const siteName = "امیرحسین شرکائی";
const siteTitle = "امیرحسین شرکائی | طراحی وب و خلاقیت دیجیتال";
const siteDescription =
  "امیرحسین شرکائی؛ طراحی و توسعه وب‌سایت‌های اختصاصی و خلق تجربه‌های بصری و تبلیغاتی با کمک هوش مصنوعی.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "امیرحسین شرکائی",
    "Amirhossein Sherkaei",
    "طراحی سایت",
    "طراحی وب",
    "توسعه وب",
    "طراحی سایت اختصاصی",
    "طراحی سایت حرفه‌ای",
    "هوش مصنوعی",
    "AI",
    "UI UX",
    "فرانت‌اند",
    "Next.js",
    "React",
    "پورتفولیو",
  ],
  applicationName: "Amirhossein Sherkaei",
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "technology",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.webp",
    apple: "/apple-icon.webp",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteUrl,
    siteName: siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  appleWebApp: {
    capable: true,
    title: siteName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  verification: {
    google: "xJlni40EBpeF6mGC_CN1Hy5ko-0pjdMar6sEvc5O_wY",
  },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
  ],
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      theme = 'dark';
    } else {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {allSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        ))}
      </head>

      <body>
        <a href="#main" className="skip-link">
          پرش به محتوای اصلی
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";

/* ═══════════════════════════════════════════════════════════
   CSS — Order matters! Tokens → Base → Layout → Pages → Enhancements
   ⚠️ globals.css is disabled — all styles are now in modular files
   ═══════════════════════════════════════════════════════════ */

/* 1. Design tokens (CSS variables) */
import "@/styles/tokens.css";

/* 2. Base — reset, layout, typography, buttons, forms, utilities */
import "@/styles/base.css";

/* 3. Layout — nav, hero, services, portfolio */
import "@/styles/layout.css";

/* 4. Layout more — project viewer, about, why, final CTA */
import "@/styles/layout-more.css";

/* 5. Footer effects — footer, back-to-top, reveal, animations */
import "@/styles/footer-effects.css";

/* 6. Pages — order, form, success, 404 */
import "@/styles/pages.css";

/* 7. Responsive — media queries, reduced motion, print */
import "@/styles/responsive.css";

/* 8. Enhancements — all batches, overrides, editorial, FAQ, etc. */
import "@/styles/enhancements.css";

/* 9. Mobile fix — glass dock mobile nav */
import "@/styles/mobile-fix.css";

/* 10. Blog styles */
import "@/app/blog/blog.css";

/* 11. globals.css is now disabled — all styles migrated to modular files */
// import "./globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { allSchemas } from "@/lib/schema";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
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
  maximumScale: 5,
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
    var theme = 'light';
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
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
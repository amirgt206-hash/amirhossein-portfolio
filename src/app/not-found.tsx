import Link from "next/link";
import BackButton from "@/components/BackButton";

const suggestions = [
  { label: "خانه", href: "/", description: "شروع دوباره از ابتدا" },
  {
    label: "خدمات",
    href: "/#services",
    description: "چهار مسیر برای شروع",
  },
  {
    label: "نمونه‌کارها",
    href: "/#portfolio",
    description: "دیدن پروژه‌ها",
  },
  {
    label: "سفارش پروژه",
    href: "/order",
    description: "شروع همکاری",
  },
];

export default function NotFound() {
  return (
    <main id="main" className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          {/* ── Top bar ── */}
          <div className="not-found-top">
            <span>AMIRHOSSEIN SHERKAEI</span>
            <span>ERROR / 404</span>
          </div>

          {/* ── Center ── */}
          <div className="not-found-center">
            <div className="not-found-number" aria-hidden="true">
              <span>4</span>
              <div className="not-found-zero">
                <div className="not-found-zero-core">
                  <span>?</span>
                </div>
              </div>
              <span>4</span>
            </div>

            <span
              className="section-index"
              style={{ justifyContent: "center" }}
            >
              PAGE NOT FOUND
            </span>

            <h1>
              این صفحه
              <span> در مسیر نیست.</span>
            </h1>

            <p>
              به نظر می‌رسد صفحه‌ای که دنبال آن هستید وجود ندارد،
              جابه‌جا شده یا آدرس آن اشتباه وارد شده است.
            </p>

            <div className="not-found-actions">
              <Link href="/" className="button button-primary">
                بازگشت به صفحه اصلی
                <span aria-hidden="true">←</span>
              </Link>

              <BackButton />
            </div>

            {/* ── Helpful links ── */}
            <div className="not-found-suggestions">
              <span className="not-found-suggestions-label">
                یا از این‌ها شروع کن
              </span>

              <div className="not-found-suggestions-grid">
                {suggestions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="not-found-suggestion"
                  >
                    <span className="not-found-suggestion-label">
                      {item.label}
                    </span>
                    <span className="not-found-suggestion-desc">
                      {item.description}
                    </span>
                    <span
                      className="not-found-suggestion-arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="not-found-bottom">
            <span>DESIGN / DEVELOPMENT / AI</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
import Link from "next/link";

export default function FinalCTA() {
  const contactEmail = process.env.PROJECT_CONTACT_EMAIL;

  return (
    <section
      className="final-cta-section section"
      aria-labelledby="final-cta-title"
    >
      <div className="container">
        <div className="final-cta reveal">
          {/* ── Left column: text + CTAs ── */}
          <div className="final-cta-content">
            <span className="section-index">06 — START A PROJECT</span>

            <h2 id="final-cta-title">
              ایده‌ای داری؟
              <br />
              <span>بیا بسازیمش.</span>
            </h2>

            <p>
              اگر پروژه‌ات مشخص است، همین حالا جزئیات را برایم بفرست.
              اگر هنوز در مرحله‌ی ایده هستی، همان را هم بنویس — با هم
              به یک طرح روشن می‌رسیم.
            </p>

            <div className="final-cta-actions">
              <Link href="/order" className="button button-primary button-lg">
                شروع پروژه
                <span aria-hidden="true">←</span>
              </Link>

              <a href="#portfolio" className="button button-secondary button-lg">
                دیدن نمونه‌کارها
              </a>
            </div>

            {contactEmail && (
              <div className="final-cta-contact">
                <span>یا مستقیم ایمیل بزن:</span>
                <a href={`mailto:${contactEmail}`} dir="ltr">
                  {contactEmail}
                </a>
              </div>
            )}
          </div>

          {/* ── Right column: brief info panel ── */}
          <aside className="final-cta-aside" aria-hidden="true">
            <div className="final-cta-aside-item">
              <span className="final-cta-aside-label">پاسخ</span>
              <strong className="final-cta-aside-value">
                حداکثر ۲۴ ساعت
              </strong>
            </div>

            <div className="final-cta-aside-item">
              <span className="final-cta-aside-label">روش تماس</span>
              <strong className="final-cta-aside-value">
                پیامک · روبیکا · ایتا
              </strong>
            </div>

            <div className="final-cta-aside-item">
              <span className="final-cta-aside-label">حوزه‌ی کار</span>
              <strong className="final-cta-aside-value">
                وب‌سایت · تبلیغات · ویدیو
              </strong>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
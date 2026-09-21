"use client";

import { useRef, useState } from "react";

type Service = {
  number: string;
  icon: "web" | "ai" | "banner" | "video";
  title: string;
  shortTitle: string;
  description: string;
  features: string[];
  deliverables: string;
  timeline: string;
  tags: string[];
};

const services: Service[] = [
  {
    number: "01",
    icon: "web",
    title: "طراحی و توسعه وب‌سایت اختصاصی",
    shortTitle: "وب‌سایت اختصاصی",
    description:
      "طراحی و توسعه وب‌سایت‌های حرفه‌ای و اختصاصی، متناسب با هویت برند و نیاز واقعی کسب‌وکار؛ با تمرکز بر تجربه کاربری، سرعت، واکنش‌گرایی و ساختار اصولی.",
    features: [
      "طراحی رابط کاربری اختصاصی، بدون قالب آماده",
      "پیاده‌سازی با HTML، CSS و JavaScript خالص",
      "بهینه برای موبایل، تبلت و دسکتاپ",
    ],
    deliverables: "وب‌سایت کامل + کد منبع",
    timeline: "۲ تا ۴ هفته",
    tags: ["UI / UX", "Development", "Responsive"],
  },
  {
    number: "02",
    icon: "ai",
    title: "طراحی وب‌سایت با کمک هوش مصنوعی",
    shortTitle: "وب + هوش مصنوعی",
    description:
      "ترکیب طراحی وب حرفه‌ای با توانایی‌های هوش مصنوعی برای خلق ایده‌های متفاوت، سریع‌تر و خلاقانه‌تر؛ از ایده‌پردازی تا تولید عناصر بصری.",
    features: [
      "تولید ایده و ساختار محتوا با کمک AI",
      "طراحی المان‌های بصری اختصاصی",
      "سرعت بالاتر در فرآیند طراحی",
    ],
    deliverables: "وب‌سایت کامل + محتوای اختصاصی",
    timeline: "۱ تا ۳ هفته",
    tags: ["AI", "Creative", "Web"],
  },
  {
    number: "03",
    icon: "banner",
    title: "طراحی بنر و تصاویر تبلیغاتی با هوش مصنوعی",
    shortTitle: "تبلیغات هوشمند",
    description:
      "خلق تصاویر و بنرهای تبلیغاتی حرفه‌ای و چشم‌گیر با کمک هوش مصنوعی، متناسب با فضای برند، کمپین و پلتفرم انتشار.",
    features: [
      "تصاویر اختصاصی، بدون استفاده از عکس‌های استوک",
      "هماهنگ با هویت بصری برند",
      "مناسب برای شبکه‌های اجتماعی و کمپین",
    ],
    deliverables: "مجموعه تصاویر + نسخه‌های مختلف",
    timeline: "۳ تا ۷ روز",
    tags: ["AI Art", "Banner", "Advertising"],
  },
  {
    number: "04",
    icon: "video",
    title: "ساخت ویدیوهای تبلیغاتی با هوش مصنوعی",
    shortTitle: "ویدیوی تبلیغاتی",
    description:
      "تولید ویدیوهای تبلیغاتی خلاقانه و سینمایی با استفاده از ابزارهای هوش مصنوعی؛ برای معرفی محصول، برند، خدمات یا کمپین‌های تبلیغاتی.",
    features: [
      "تولید ویدیوی کوتاه و هدفمند",
      "مناسب برای اینستاگرام و تیزر",
      "بدون نیاز به تیم فیلم‌برداری",
    ],
    deliverables: "ویدیوی نهایی + نسخه‌های سایز",
    timeline: "۱ تا ۲ هفته",
    tags: ["AI Video", "Cinematic", "Creative"],
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = services[active];

  const focusTab = (index: number) => {
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const last = services.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      nextIndex = index === last ? 0 : index + 1;
    } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      nextIndex = index === 0 ? last : index - 1;
    } else if (event.key === "Home") {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      nextIndex = last;
    } else {
      return;
    }

    focusTab(nextIndex);
  };

  const activeNumber = String(active + 1).padStart(2, "0");
  const totalNumber = String(services.length).padStart(2, "0");

  return (
    <section id="services" className="services-section section">
      <div className="container">
        {/* ═══════ EDITORIAL MASTHEAD ═══════ */}
        <div className="services-masthead reveal">
          <span className="services-masthead-left">
            CHAPTER&nbsp;·&nbsp;01&nbsp;—&nbsp;SERVICES
          </span>
          <span className="services-masthead-center" aria-hidden="true">
            §
          </span>
          <span className="services-masthead-right">
            SELECTED&nbsp;·&nbsp;۱۴۰۴
          </span>
        </div>

        <div className="section-heading reveal">
          <div>
            <span className="section-index">01 — SERVICES</span>
            <h2>
              از ایده تا یک
              <em> حضور دیجیتال حرفه‌ای</em>
            </h2>
          </div>
          <p>
            چهار مسیر برای ساختن یک تجربه‌ی دیجیتال؛ از طراحی وب‌سایت
            اختصاصی تا تولید محتوای بصری با کمک هوش مصنوعی.
          </p>
        </div>

        <div className="services-layout">
          <div
            className="services-list reveal"
            role="tablist"
            aria-label="فهرست خدمات"
            aria-orientation="vertical"
          >
            {/* ── Editorial list header ── */}
            <div className="services-list-header" aria-hidden="true">
              <span className="services-list-header-label">INDEX</span>
              <span className="services-list-header-count">
                {activeNumber}&nbsp;/&nbsp;{totalNumber}
              </span>
            </div>

            {services.map((service, index) => (
              <button
                key={service.number}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`service-tab-${index}`}
                aria-selected={active === index}
                aria-controls={`service-panel-${index}`}
                tabIndex={active === index ? 0 : -1}
                className={`service-item ${
                  active === index ? "is-active" : ""
                }`}
                onClick={() => setActive(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {/* Editorial dot — fills on active */}
                <span className="service-item-dot" aria-hidden="true" />

                <span className="service-number">{service.number}</span>

                <span className="service-icon" aria-hidden="true">
                  <ServiceIcon type={service.icon} />
                </span>

                <span className="service-title">{service.shortTitle}</span>

                <span className="service-arrow" aria-hidden="true">
                  ↙
                </span>
              </button>
            ))}
          </div>

          <div
            className="service-preview reveal"
            role="tabpanel"
            id={`service-panel-${active}`}
            aria-labelledby={`service-tab-${active}`}
          >
            {/* ═══════ CORNER MARKS ═══════ */}
            <span
              className="service-preview-corner service-preview-corner-tl"
              aria-hidden="true"
            />
            <span
              className="service-preview-corner service-preview-corner-tr"
              aria-hidden="true"
            />
            <span
              className="service-preview-corner service-preview-corner-bl"
              aria-hidden="true"
            />
            <span
              className="service-preview-corner service-preview-corner-br"
              aria-hidden="true"
            />

            <div className="service-preview-top">
              <span>
                {current.number} / {String(services.length).padStart(2, "0")}
              </span>
              <span>SELECTED SERVICE</span>
            </div>

            <div className="service-preview-content">
              <span className="service-preview-label">
                {current.shortTitle}
              </span>

              <h3>{current.title}</h3>

              <p>{current.description}</p>

              <ul className="service-features">
                {current.features.map((feature) => (
                  <li key={feature} className="service-feature">
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="service-meta">
                <div className="service-meta-item">
                  <span>تحویل</span>
                  <strong>{current.deliverables}</strong>
                </div>
                <div className="service-meta-item">
                  <span>زمان تقریبی</span>
                  <strong>{current.timeline}</strong>
                </div>
              </div>

              <div className="service-tags">
                {current.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="service-visual" aria-hidden="true">
              <span className="service-visual-numeral">
                {current.number}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Small inline icons for each service — no external icon library
   ------------------------------------------------------------ */
function ServiceIcon({ type }: { type: Service["icon"] }) {
  switch (type) {
    case "web":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
          <circle cx="6" cy="6.5" r="0.6" fill="currentColor" />
          <circle cx="8.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "ai":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      );
    case "banner":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8" cy="10" r="2" />
          <path d="M3 17l5-4 4 3 3-2 6 4" />
        </svg>
      );
    case "video":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="6" width="14" height="12" rx="2" />
          <path d="M17 9l4-2v10l-4-2" />
        </svg>
      );
  }
}
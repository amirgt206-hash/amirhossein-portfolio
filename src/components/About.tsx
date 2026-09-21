import { projects } from "@/content/projects";

const skills = [
  "Web Design",
  "Frontend",
  "UI / UX",
  "Responsive",
  "AI Creative",
  "AI Visual",
];

const principles = [
  {
    number: "01",
    title: "طراحی قبل از کد",
    text: "قبل از نوشتن یک خط کد، ساختار و تجربه‌ی کاربر را در ذهن می‌سازم. طراحی، تصمیم است — نه تزئین.",
  },
  {
    number: "02",
    title: "جزئیات کوچک، اثر بزرگ",
    text: "فاصله‌ها، حرکت‌ها و ریز‌جزئیات بصری، همان چیزی هستند که یک سایت حرفه‌ای را از یک سایت معمولی جدا می‌کنند.",
  },
  {
    number: "03",
    title: "سرعت، بخشی از طراحی",
    text: "یک سایت کند، حتی اگر زیبا باشد، تجربه‌ی خوبی نمی‌سازد. عملکرد را از ابتدا در طراحی لحاظ می‌کنم.",
  },
];

const facts = [
  { label: "ROLE", value: "Designer + Developer" },
  { label: "FOCUS", value: "Web · AI · Brand" },
  { label: "BASE", value: "Iran · Remote" },
  { label: "STATUS", value: "Available" },
];

export default function About() {
  const projectCount = String(projects.length).padStart(2, "0");

  const stats = [
    { value: projectCount, label: "نمونه‌کار" },
    { value: "۰۴", label: "خدمات تخصصی" },
    { value: "۱۰۰٪", label: "طراحی اختصاصی" },
    { value: "۱۴۰۴", label: "سال شروع" },
  ];

  return (
    <section id="about" className="about-section section">
      <div className="container">
        {/* ═══════ IDENTITY BLOCK ═══════ */}
        <div className="about-identity reveal">
          <span className="section-index">03 — ABOUT</span>

          <h2 className="about-identity-title">
            <span>I&apos;m Amirhossein.</span>
            <span className="about-identity-em">I design. I build.</span>
            <span>I experiment with AI.</span>
          </h2>

          <div className="about-identity-rule" aria-hidden="true" />

          <p className="about-identity-sub">
            طراح · توسعه‌دهنده · خلاق دیجیتال
          </p>

          {/* Fact strip */}
          <ul className="about-facts">
            {facts.map((fact) => (
              <li key={fact.label} className="about-fact">
                <span className="about-fact-label">{fact.label}</span>
                <span className="about-fact-value">{fact.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ═══════ NARRATIVE + STATEMENT ═══════ */}
        <div className="about-grid">
          <div className="about-content reveal">
            <h2>
              طراحی برای من،
              <span> فقط ساختن یک ظاهر زیبا </span>
              <em>نیست.</em>
            </h2>

            <h3 id="about-title" className="about-lead">
              هدف من ساخت تجربه‌ای است که هم از نظر بصری متمایز باشد و هم
              واقعاً برای کاربر و کسب‌وکار کاربرد داشته باشد.
            </h3>

            <p>
              در طراحی و توسعه پروژه‌ها، تلاش می‌کنم بین طراحی خلاقانه،
              تجربه کاربری، عملکرد فنی و امکانات مدرن تعادل ایجاد کنم.
              استفاده از ابزارهای هوش مصنوعی هم بخشی از این مسیر است؛
              نه به‌عنوان جایگزین خلاقیت، بلکه به‌عنوان ابزاری برای
              رسیدن سریع‌تر و متفاوت‌تر به ایده‌ها.
            </p>

            <div className="about-skills" aria-label="مهارت‌ها">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>

          <aside className="about-statement reveal" aria-hidden="true">
            <span className="about-statement-mark">&ldquo;</span>

            <p className="about-statement-text">
              طراحی، برای من
              <br />
              ترکیبی از <em>سلیقه</em>،
              <br />
              <em>دقت</em> و <em>کاربرد</em> است.
            </p>

            <div className="about-statement-sign">
              <span className="about-statement-name">امیرحسین شرکائی</span>
              <span className="about-statement-latin">
                AMIRHOSSEIN SHERKAEI
              </span>
            </div>
          </aside>
        </div>

        {/* ═══════ STATS STRIP ═══════ */}
        <div className="about-stats reveal" aria-label="آمار کوتاه">
          {stats.map((stat) => (
            <div key={stat.label} className="about-stat">
              <span className="about-stat-value">{stat.value}</span>
              <span className="about-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ═══════ PRINCIPLES ═══════ */}
        <div className="about-principles reveal">
          <div className="about-principles-heading">
            <span className="eyebrow">اصول کاری</span>
          </div>

          <div className="about-principles-grid">
            {principles.map((principle) => (
              <article key={principle.number} className="about-principle">
                <span className="about-principle-number">
                  {principle.number}
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
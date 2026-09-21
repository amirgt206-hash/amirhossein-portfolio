const reasons = [
  {
    number: "01",
    title: "طراحی اختصاصی، بدون قالب",
    text: "هر پروژه از صفر طراحی می‌شود؛ نه بر اساس یک قالب آماده یا الگوی تکراری. ساختار، رنگ و حرکت، دقیقاً بر اساس هدف همان پروژه ساخته می‌شود.",
  },
  {
    number: "02",
    title: "تمرکز روی جزئیات",
    text: "از فاصله‌ها و تایپوگرافی تا انیمیشن‌ها و حالت‌های hover؛ جزئیات کوچک همان چیزی هستند که تجربه را حرفه‌ای می‌کنند.",
  },
  {
    number: "03",
    title: "ترکیب طراحی و تکنولوژی",
    text: "طراحی حرفه‌ای، در کنار توسعه‌ی مدرن و استفاده‌ی هوشمندانه از ابزارهای جدید — بدون اینکه سرعت یا دسترسی‌پذیری فدا شوند.",
  },
];

export default function WhyMe() {
  return (
    <section className="why-section section" aria-labelledby="why-title">
      <div className="container">
        <div className="why-header reveal">
          <div>
            <span className="section-index">04 — WHY ME</span>

            <h2 id="why-title">
              متفاوت فکر می‌کنم،
              <span> دقیق اجرا می‌کنم.</span>
            </h2>
          </div>

          <p>
            سه چیزی که مسیر هر پروژه را متفاوت می‌کند — نه با قالب
            آماده، نه با حداقل تلاش.
          </p>
        </div>

        <ul className="why-list reveal">
          {reasons.map((reason) => (
            <li key={reason.number} className="why-item">
              <span className="why-num">{reason.number}</span>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </li>
          ))}
        </ul>

        <div className="why-signature reveal">
          <div className="why-signature-line" aria-hidden="true" />
          <p className="why-signature-text">
            اگر دنبال یک سایت سریع، اختصاصی و قابل‌تشخیص هستی،
            <a href="/order"> بیا با هم شروع کنیم</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
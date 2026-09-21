export type ProjectStatus =
  | "پروژه مفهومی"
  | "پروژه شخصی"
  | "مطالعه موردی"
  | "آماده همکاری";

export type ProjectVisual =
  | "preview-web"
  | "preview-shop"
  | "preview-ai"
  | "preview-video"
  | "preview-mobile"
  | "preview-editorial";

/* ─────────────────────────────────────────────────────────────
   Case Study — داستان کامل پروژه
   ───────────────────────────────────────────────────────────── */
export type ProjectCaseStudy = {
  /* خلاصه یک پاراگرافی از پروژه */
  overview: string;

  /* چالش اصلی که پروژه باید حل می‌کرد */
  challenge: string;

  /* رویکرد و استراتژی (لیست bullet) */
  approach: string[];

  /* نقاط برجسته طراحی/فنی (لیست bullet) */
  highlights: string[];

  /* آمار و نتایج کلیدی (اختیاری) */
  metrics?: Array<{
    label: string;
    value: string;
  }>;

  /* درس‌آموخته‌ها (اختیاری) */
  learnings?: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];

  /* Visual — real screenshot from /public/projects/ */
  coverImage?: string;

  /* Optional */
  fullDescription?: string;
  images?: string[];
  technologies?: string[];
  projectUrl?: string;
  demoUrl?: string;
  liveDemoUrl?: string;      /* ← فیلد جدید: لینک دموی زنده */
  status?: ProjectStatus;
  year?: string;
  role?: string;

  /* ── Case Study ── */
  caseStudy?: ProjectCaseStudy;
};

/* ═════════════════════════════════════════════════════════════
   PROJECTS
   ═════════════════════════════════════════════════════════════ */
export const projects: Project[] = [
  {
    id: "project-01",
    title: "آرکا",
    category: "پلتفرم SaaS",
    description:
      "صفحه فرود SaaS که در کمتر از ۱۲ ثانیه، ارزش محصول را به بازدیدکننده منتقل می‌کند — بدون متن‌های طولانی.",
    tags: ["SaaS", "Web Design", "Corporate"],
    coverImage: "/projects/arka.webp",
    liveDemoUrl: "/projects/arka.html",
    year: "۱۴۰۴",
    status: "پروژه مفهومی",
    role: "طراح و توسعه‌دهنده",
    technologies: ["HTML", "CSS", "JavaScript"],

    caseStudy: {
      overview:
        "آرکا یک پروژه مفهومی در حوزه SaaS است که با هدف کاوش در طراحی صفحات فرود مدرن طراحی شد. تمرکز اصلی: ساخت صفحه‌ای که بدون متن‌های طولانی، ارزش محصول را در چند ثانیه منتقل کند.",

      challenge:
        "اکثر سایت‌های SaaS ایرانی با متن‌های طولانی و اصطلاحات فنی، کاربر را گیج می‌کنند. سؤال طراحی این بود: چطور می‌شود در ۳ ثانیه، کاربر بفهمد محصول چیست، برای چه کسی است، و چه ارزشی دارد؟",

      approach: [
        "تحلیل ۲۰ سایت موفق SaaS ایرانی و خارجی برای شناسایی الگوهای مشترک",
        "طراحی معماری اطلاعات با تمرکز بر سلسله‌مراتب بصری واضح",
        "ساخت دیزاین سیستم مینیمال با پالت خنثی + یک رنگ تأکیدی",
        "پیاده‌سازی با HTML/CSS/JS خالص برای کنترل کامل روی جزئیات",
        "تست سه نسخه مختلف Hero Section",
      ],

      highlights: [
        "Hero Section که در ۳ ثانیه پیام اصلی را منتقل می‌کند",
        "داشبورد mockup با داده‌های شبیه‌سازی‌شده زنده",
        "سیستم pricing با toggle ماهانه/سالانه",
        "FAQ accordion و tab system بدون کتابخانه خارجی",
        "دسترسی‌پذیری کامل طبق WCAG 2.2 AA",
      ],

      metrics: [
        { label: "زمان درک پیام اصلی", value: "۳ ثانیه" },
        { label: "تعداد بخش‌های طراحی‌شده", value: "۷ بخش" },
        { label: "زمان پروژه", value: "۲ هفته" },
      ],

      learnings:
        "در طراحی SaaS، «کمتر» همیشه «بیشتر» است. حذف ۴۰٪ از متن‌ها، تجربه کاربر را به‌طرز محسوسی بهتر کرد.",
    },
  },

  {
    id: "project-02",
    title: "نیلا",
    category: "فروشگاه آنلاین",
    description:
      "فروشگاه آنلاین پوشاک با مسیر خرید ۴ مرحله‌ای و سبد خرید drawer — تجربه‌ای روان از دیدن محصول تا پرداخت.",
    tags: ["E-Commerce", "Fashion", "UI/UX"],
    coverImage: "/projects/nila.webp",
    liveDemoUrl: "/projects/nila.html",
    year: "۱۴۰۴",
    status: "پروژه مفهومی",
    role: "طراح و توسعه‌دهنده",
    technologies: ["HTML", "CSS", "JavaScript"],

    caseStudy: {
      overview:
        "نیلا یک پروژه مفهومی در حوزه فروشگاه آنلاین پوشاک است. هدف: طراحی تجربه‌ای که مشتری را نگه دارد — با کاهش اصطکاک در مسیر خرید و ایجاد حس اطمینان در هر مرحله.",

      challenge:
        "فروشگاه‌های آنلاین پوشاک معمولاً با مشکل «سبد خرید رهاشده» مواجهند. علت اصلی، پیچیدگی فرآیند خرید و عدم اطمینان از تصمیم است.",

      approach: [
        "طراحی مسیر خرید در ۴ مرحله واضح: مشاهده، انتخاب، اطلاعات، پرداخت",
        "سبد خرید drawer که در همه صفحات قابل دسترسی است",
        "Quick View modal برای مشاهده سریع محصول بدون ترک صفحه",
        "فیلترهای هوشمند محصولات با ذخیره وضعیت",
        "اولویت‌بندی موبایل به عنوان تجربه اصلی (Mobile-first)",
      ],

      highlights: [
        "سبد خرید تعاملی با افزایش/کاهش تعداد و حذف محصول",
        "Quick View modal با انتخاب سایز",
        "Product filter system با ذخیره وضعیت",
        "سیستم Toast برای بازخورد بصری هر اقدام",
        "طراحی احساسی برای ایجاد اعتماد (Badges, Reviews)",
      ],

      metrics: [
        { label: "مراحل خرید", value: "۴ مرحله" },
        { label: "تعداد محصولات نمونه", value: "۸ محصول" },
        { label: "زمان پروژه", value: "۳ هفته" },
      ],

      learnings:
        "طراحی فروشگاه، بیشتر از طراحی رابط کاربری، به روانشناسی کاربر مربوط می‌شود. اعتماد و اطمینان، مهم‌تر از زیبایی است.",
    },
  },

  {
    id: "project-03",
    title: "ویرا",
    category: "هویت بصری AI",
    description:
      "برندبوک کامل یک استودیو — پالت رنگی تعاملی، سیستم تایپوگرافی، ۶ واریاسیون لوگو، و مجموعه‌ای از کاربردهای عملی.",
    tags: ["AI Creative", "Branding", "Visual"],
    coverImage: "/projects/vira.webp",
    liveDemoUrl: "/projects/vira.html",
    year: "۱۴۰۴",
    status: "پروژه مفهومی",
    role: "طراح هویت بصری",
    technologies: ["AI Generation", "Brand Design", "HTML/CSS"],

    caseStudy: {
      overview:
        "ویرا یک پروژه مستقل هویت بصری است که برای کاوش در مرزهای هوش مصنوعی و برندینگ طراحی شد. هدف: ساخت یک سیستم هویت بصری کامل در زمانی کوتاه، با استفاده از ابزارهای AI به عنوان تسریع‌کننده.",

      challenge:
        "استودیوهای کوچک معمولاً نمی‌توانند هزینه و زمان لازم برای ساخت هویت بصری کامل را بپردازند. سؤال طراحی: چطور می‌شود با کمک AI، فرآیند را چند برابر سریع‌تر کرد — بدون کاهش کیفیت؟",

      approach: [
        "طراحی پالت رنگی ۵ مرحله‌ای با تحلیل روانشناسی رنگ",
        "سیستم تایپوگرافی سه‌فونته (Display + Body + Mono) با هماهنگی بصری",
        "تولید ۶ واریاسیون از لوگو برای بسترهای مختلف",
        "طراحی کاربردهای عملی در ۴ حوزه: چاپ، بسته‌بندی، دیجیتال، محیطی",
        "ساخت برندبوک تعاملی با قابلیت کپی رنگ‌ها",
      ],

      highlights: [
        "پالت رنگی تعاملی با copy-to-clipboard",
        "Type scale showcase با ۶ سطح مختلف",
        "۶ واریاسیون لوگو (Primary, Outline, Gradient, Color, Italic, Inverse)",
        "Orbit animation برای نمایش هویت بصری",
        "بخش Applications با ۴ کاربرد عملی",
      ],

      metrics: [
        { label: "تعداد asset", value: "۲۴۰+" },
        { label: "زمان پروژه", value: "۳ هفته" },
        { label: "کاهش هزینه", value: "۶۰٪" },
      ],

      learnings:
        "هوش مصنوعی جایگزین طراح نیست، بلکه ابزاری است که سرعت اجرا را چند برابر می‌کند. اما نظارت انسانی و چشم طراح، همچنان حیاتی است.",
    },
  },

  {
    id: "project-04",
    title: "لومن",
    category: "کمپین سینمایی",
    description:
      "کمپین تبلیغاتی سینمایی با storyboard، timeline تولید، و روایتی که به‌جای فریاد زدن پیام، آن را در سکوت پنهان می‌کند.",
    tags: ["AI Video", "Campaign", "Cinematic"],
    coverImage: "/projects/lumen.webp",
    liveDemoUrl: "/projects/lumen.html",
    year: "۱۴۰۴",
    status: "پروژه مفهومی",
    role: "کارگردان خلاق",
    technologies: ["AI Video", "Storyboard", "Motion"],

    caseStudy: {
      overview:
        "لومن یک پروژه مفهومی کمپین سینمایی است که با هدف کاوش در روایت‌های تبلیغاتی متفاوت طراحی شد. چالش: ساخت یک تجربه روایی بدون دیالوگ، فقط با تصویر، نور و ریتم.",

      challenge:
        "تولید ویدیوی تبلیغاتی سینمایی به‌طور معمول نیاز به تیم بزرگ و بودجه سنگین دارد. اما با ابزارهای AI، می‌توان این فرآیند را تا ۸۰٪ سریع‌تر کرد — اگر بدانی چطور.",

      approach: [
        "ایده‌پردازی روایی بر اساس ساختار سه‌پرده‌ای (Setup, Confrontation, Resolution)",
        "طراحی استوری‌بورد دقیق با ۶ فریم کلیدی",
        "ساخت صفحه‌ای که خودش مثل یک فیلم روایت می‌شود",
        "استفاده از film grain و vignette برای حس سینمایی",
        "طراحی timeline تولید در ۴ مرحله شفاف",
      ],

      highlights: [
        "روایت سینمایی با ساختار سه‌پرده‌ای کلاسیک",
        "۶ storyboard frame با طراحی اختصاصی",
        "Timeline تولید شفاف در ۴ مرحله",
        "Video stage با play animation",
        "Film grain overlay برای حس سینمایی واقعی",
      ],

      metrics: [
        { label: "مدت کمپین", value: "۴۸ ثانیه" },
        { label: "زمان تولید", value: "۲ هفته" },
        { label: "کاهش هزینه", value: "۸۰٪" },
      ],

      learnings:
        "در تولید محتوای ویدیویی، «ایده» همچنان مهم‌ترین عنصر است. ابزارها فقط اجرا را سریع‌تر می‌کنند، نه بهتر.",
    },
  },
];
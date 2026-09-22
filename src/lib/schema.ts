/* ═══════════════════════════════════════════════════════════════
   Schema.org Structured Data
   ═══════════════════════════════════════════════════════════════ */

import { projects } from "@/content/projects";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://amirhossein-portfolio.vercel.app";

/* ─────────────────────────────────────────────────────────────
   1. PERSON
   ───────────────────────────────────────────────────────────── */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "امیرحسین شرکائی",
  alternateName: "Amirhossein Sherkaei",
  url: SITE_URL,
  image: `${SITE_URL}/icon.webp`,
  jobTitle: "Frontend Developer & UI/UX Designer",
  description:
    "طراح و توسعه‌دهنده وب با تخصص در ساخت وب‌سایت‌های اختصاصی و خلاقیت دیجیتال با کمک هوش مصنوعی.",
  knowsAbout: [
    "Web Design",
    "Web Development",
    "Frontend Development",
    "UI/UX Design",
    "Artificial Intelligence",
    "Next.js",
    "React",
    "TypeScript",
  ],
};

/* ─────────────────────────────────────────────────────────────
   2. WEBSITE
   ───────────────────────────────────────────────────────────── */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: "امیرحسین شرکائی",
  alternateName: "Amirhossein Sherkaei",
  description:
    "پورتفولیوی امیرحسین شرکائی — طراحی و توسعه وب‌سایت‌های اختصاصی، UI/UX و خلاقیت دیجیتال.",
  inLanguage: "fa-IR",
};

/* ─────────────────────────────────────────────────────────────
   3. SERVICE
   ───────────────────────────────────────────────────────────── */
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Amirhossein Sherkaei",
  url: SITE_URL,
  image: `${SITE_URL}/icon.webp`,
  description:
    "طراحی و توسعه وب‌سایت‌های اختصاصی، رابط کاربری، تجربه کاربری و خلاقیت دیجیتال.",
  areaServed: "Iran",
};

/* ─────────────────────────────────────────────────────────────
   4. BREADCRUMB
   ───────────────────────────────────────────────────────────── */
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "خانه",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "نمونه‌کارها",
      item: `${SITE_URL}#portfolio`,
    },
  ],
};

/* ─────────────────────────────────────────────────────────────
   5. PROJECTS
   ───────────────────────────────────────────────────────────── */
export function getProjectSchemas() {
  return projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
    },
    keywords: project.tags.join(", "),
    genre: project.category,
  }));
}

/* ─────────────────────────────────────────────────────────────
   6. BLOG POST
   ───────────────────────────────────────────────────────────── */
export function getBlogPostSchema(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/icon.webp`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.webp`,
      },
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    inLanguage: "fa-IR",
  };
}

/* ─────────────────────────────────────────────────────────────
   7. BLOG (Index Page)
   ───────────────────────────────────────────────────────────── */
export function getBlogIndexSchema(
  posts: Array<{
    slug: string;
    title: string;
    date: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "بلاگ امیرحسین شرکائی",
    description:
      "مقالات درباره‌ی طراحی وب، افزایش فروش، سئو و تجربه‌ی کاربری",
    url: `${SITE_URL}/blog`,
    inLanguage: "fa-IR",
    author: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
      url: SITE_URL,
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };
}

/* ─────────────────────────────────────────────────────────────
   Bundle
   ───────────────────────────────────────────────────────────── */
export const allSchemas = [
  personSchema,
  websiteSchema,
  serviceSchema,
  breadcrumbSchema,
  ...getProjectSchemas(),
];
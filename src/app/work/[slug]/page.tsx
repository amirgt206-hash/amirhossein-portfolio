import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  projects,
} from "@/content/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://amirhossein-portfolio.vercel.app";

/* ── Static generation ── */
export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

/* ── Metadata ── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "پروژه یافت نشد" };

  return {
    title: `${project.title} — ${project.category}`,
    description: project.description,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: `${project.title} | امیرحسین شرکائی`,
      description: project.description,
      type: "article",
      url: `${siteUrl}/work/${slug}`,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  /* Related — other projects in same category, or next ones */
  const related = projects
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  /* Schema.org — CreativeWork */
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteUrl}/work/${slug}`,
    image: project.coverImage ? `${siteUrl}${project.coverImage}` : undefined,
    creator: {
      "@type": "Person",
      name: "امیرحسین شرکائی",
      url: siteUrl,
    },
    keywords: project.tags.join(", "),
    genre: project.category,
    dateCreated: project.year,
  };

  return (
    <main id="main" className="work-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container">
        {/* ═══════ Breadcrumb ═══════ */}
        <nav className="work-breadcrumb" aria-label="مسیر">
          <Link href="/">خانه</Link>
          <span aria-hidden="true">/</span>
          <Link href="/work">نمونه‌کارها</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>

        {/* ═══════ Hero ═══════ */}
        <header className="work-detail-header">
          <div className="work-detail-header-meta">
            <span className="section-index">
              {project.category.toUpperCase()}
            </span>
            {project.status && (
              <span className="work-detail-status">{project.status}</span>
            )}
          </div>

          <h1 className="work-detail-title">
            {project.title}
            <span className="work-detail-latin"> / {project.latinTitle}</span>
          </h1>

          <p className="work-detail-lead">{project.description}</p>

          <dl className="work-detail-facts">
            <div>
              <dt>نقش</dt>
              <dd>{project.role || "طراح و توسعه‌دهنده"}</dd>
            </div>
            <div>
              <dt>سال</dt>
              <dd>{project.year || "—"}</dd>
            </div>
            <div>
              <dt>مدت</dt>
              <dd>{project.duration || "—"}</dd>
            </div>
            <div>
              <dt>کارفرما</dt>
              <dd>{project.client || "—"}</dd>
            </div>
          </dl>

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary button-lg work-detail-demo"
            >
              <span className="work-detail-demo-dot" aria-hidden="true" />
              مشاهده دموی زنده
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                width="14"
                height="14"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </header>

        {/* ═══════ Cover ═══════ */}
        {project.coverImage && (
          <div className="work-detail-cover">
            <Image
              src={project.coverImage}
              alt={`نمونه‌کار ${project.title}`}
              fill
              sizes="(max-width: 720px) 100vw, 1120px"
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* ═══════ Case Study ═══════ */}
        {project.caseStudy && (
          <article className="work-detail-content">
            {/* Overview */}
            <section className="work-detail-section">
              <div className="work-detail-section-head">
                <span className="work-detail-section-num">۰۱</span>
                <h2>خلاصه پروژه</h2>
              </div>
              <p>{project.caseStudy.overview}</p>
            </section>

            {/* Challenge */}
            <section className="work-detail-section">
              <div className="work-detail-section-head">
                <span className="work-detail-section-num">۰۲</span>
                <h2>چالش اصلی</h2>
              </div>
              <p>{project.caseStudy.challenge}</p>
            </section>

            {/* Approach */}
            {project.caseStudy.approach.length > 0 && (
              <section className="work-detail-section">
                <div className="work-detail-section-head">
                  <span className="work-detail-section-num">۰۳</span>
                  <h2>رویکرد من</h2>
                </div>
                <ul className="work-detail-list">
                  {project.caseStudy.approach.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Highlights */}
            {project.caseStudy.highlights.length > 0 && (
              <section className="work-detail-section">
                <div className="work-detail-section-head">
                  <span className="work-detail-section-num">۰۴</span>
                  <h2>نقاط برجسته</h2>
                </div>
                <ul className="work-detail-list work-detail-list--accent">
                  {project.caseStudy.highlights.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Metrics */}
            {project.caseStudy.metrics &&
              project.caseStudy.metrics.length > 0 && (
                <section className="work-detail-metrics">
                  {project.caseStudy.metrics.map((m) => (
                    <div key={m.label} className="work-detail-metric">
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </section>
              )}

            {/* Learnings */}
            {project.caseStudy.learnings && (
              <section className="work-detail-section work-detail-section--quote">
                <div className="work-detail-section-head">
                  <span className="work-detail-section-num">۰۵</span>
                  <h2>درس‌آموخته</h2>
                </div>
                <blockquote>{project.caseStudy.learnings}</blockquote>
              </section>
            )}

            {/* Tech */}
            {project.technologies && project.technologies.length > 0 && (
              <section className="work-detail-tech">
                <span className="work-detail-tech-label">تکنولوژی‌ها</span>
                <ul className="work-detail-tech-list">
                  {project.technologies.map((tech) => (
                    <li key={tech} className="work-detail-tech-chip">
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        )}

        {/* ═══════ CTA ═══════ */}
        <div className="work-detail-cta">
          <div className="work-detail-cta-content">
            <h2>پروژه‌ای مشابه می‌خواهی؟</h2>
            <p>جزئیات پروژه‌ات را بفرست تا با هم بررسی کنیم.</p>
          </div>
          <Link href="/order" className="button button-primary button-lg">
            شروع پروژه
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        {/* ═══════ Related ═══════ */}
        {related.length > 0 && (
          <section className="work-detail-related">
            <h2 className="work-detail-related-title">پروژه‌های دیگر</h2>
            <div className="work-grid">
              {related.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="work-card"
                >
                  <div className="work-card-visual">
                    {p.coverImage && (
                      <Image
                        src={p.coverImage}
                        alt={`نمونه‌کار ${p.title}`}
                        fill
                        sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 420px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="work-card-body">
                    <span className="work-card-category">
                      {p.category}
                    </span>
                    <h3 className="work-card-title">{p.title}</h3>
                    <p className="work-card-desc">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
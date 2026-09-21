"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";

type ProjectViewerProps = {
  project: Project;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  onClose: () => void;
};

export default function ProjectViewer({
  project,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: ProjectViewerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [shareLabel, setShareLabel] = useState("اشتراک‌گذاری");

  useEffect(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && onNext) {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key === "ArrowRight" && onPrev) {
        event.preventDefault();
        onPrev();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    setShareLabel("اشتراک‌گذاری");
  }, [project.id]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: project.title,
          text: project.description,
          url,
        });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareLabel("کپی شد ✓");
        window.setTimeout(() => setShareLabel("اشتراک‌گذاری"), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div
      className="project-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="project-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* ═══════ Navigation bar (بالای modal) ═══════ */}
        <div className="project-modal-nav">
          <div className="project-modal-nav-left">
            <span className="project-modal-nav-counter">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-nav-demo"
              >
                <span
                  className="project-modal-nav-demo-dot"
                  aria-hidden="true"
                />
                <span className="project-modal-nav-demo-text">
                  مشاهده دموی زنده
                </span>
                <ExternalIcon />
              </a>
            )}
          </div>

          <div className="project-modal-nav-buttons">
            <button
              type="button"
              className="project-modal-nav-btn"
              onClick={onPrev}
              disabled={!onPrev}
              aria-label="پروژه‌ی قبلی"
            >
              →
            </button>
            <button
              type="button"
              className="project-modal-nav-btn"
              onClick={onNext}
              disabled={!onNext}
              aria-label="پروژه‌ی بعدی"
            >
              ←
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              className="project-modal-nav-btn"
              onClick={onClose}
              aria-label="بستن"
            >
              ×
            </button>
          </div>
        </div>

        {/* ═══════ Main content ═══════ */}
        <div className="project-modal-main">
          <div className="project-modal-visual">
            {project.coverImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.coverImage}
                alt={`نمونه‌کار ${project.title}`}
                loading="eager"
                decoding="async"
              />
            ) : (
              <>
                <span className="eyebrow">{project.category}</span>
                <strong id="project-modal-title">{project.title}</strong>
              </>
            )}

            {project.caseStudy?.metrics &&
              project.caseStudy.metrics.length > 0 && (
                <div className="project-modal-metrics">
                  {project.caseStudy.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="project-modal-metric"
                    >
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="project-modal-body">
            <span
              className="section-index"
              style={{ marginBottom: 0 }}
            >
              PROJECT · {project.id.split("-").pop()}
            </span>

            <h2 id="project-modal-title">{project.title}</h2>

            <div className="project-modal-subtitle">
              <span>{project.category}</span>
              {project.year && (
                <>
                  <span className="dot">·</span>
                  <span>{project.year}</span>
                </>
              )}
              {project.role && (
                <>
                  <span className="dot">·</span>
                  <span>{project.role}</span>
                </>
              )}
            </div>

            <p>{project.description}</p>

            {project.caseStudy && (
              <div className="project-case-study">
                {project.caseStudy.overview && (
                  <div className="case-study-section">
                    <h3 className="case-study-heading">
                      <span className="case-study-num">۰۱</span>
                      خلاصه پروژه
                    </h3>
                    <p>{project.caseStudy.overview}</p>
                  </div>
                )}

                {project.caseStudy.challenge && (
                  <div className="case-study-section">
                    <h3 className="case-study-heading">
                      <span className="case-study-num">۰۲</span>
                      چالش اصلی
                    </h3>
                    <p>{project.caseStudy.challenge}</p>
                  </div>
                )}

                {project.caseStudy.approach &&
                  project.caseStudy.approach.length > 0 && (
                    <div className="case-study-section">
                      <h3 className="case-study-heading">
                        <span className="case-study-num">۰۳</span>
                        رویکرد من
                      </h3>
                      <ul className="case-study-list">
                        {project.caseStudy.approach.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {project.caseStudy.highlights &&
                  project.caseStudy.highlights.length > 0 && (
                    <div className="case-study-section">
                      <h3 className="case-study-heading">
                        <span className="case-study-num">۰۴</span>
                        نقاط برجسته
                      </h3>
                      <ul className="case-study-list case-study-list--highlight">
                        {project.caseStudy.highlights.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {project.caseStudy.learnings && (
                  <div className="case-study-section case-study-section--quote">
                    <h3 className="case-study-heading">
                      <span className="case-study-num">۰۵</span>
                      درس‌آموخته
                    </h3>
                    <blockquote>{project.caseStudy.learnings}</blockquote>
                  </div>
                )}
              </div>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="project-modal-tech">
                <span className="project-modal-tech-label">
                  تکنولوژی‌ها
                </span>
                <div className="project-modal-tech-list">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="project-modal-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="project-modal-meta-grid">
              <div>
                <span>دسته‌بندی</span>
                <strong>{project.category}</strong>
              </div>
              <div>
                <span>وضعیت</span>
                <strong>{project.status ?? "آماده همکاری"}</strong>
              </div>
              <div>
                <span>سال</span>
                <strong>{project.year ?? "۱۴۰۴"}</strong>
              </div>
              <div>
                <span>نقش</span>
                <strong>{project.role ?? "طراح و توسعه‌دهنده"}</strong>
              </div>
            </div>

            {/* ── Actions (پایین modal) ── */}
            <div className="project-modal-actions">
              <a href="/order" className="button button-primary">
                پروژه‌ای مشابه می‌خواهم
                <span aria-hidden="true">←</span>
              </a>

              <button
                type="button"
                className="project-modal-share"
                onClick={handleShare}
              >
                <ShareIcon />
                {shareLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
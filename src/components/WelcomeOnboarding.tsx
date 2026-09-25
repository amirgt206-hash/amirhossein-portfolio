"use client";

import { useEffect, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   WELCOME ONBOARDING
   ------------------------------------------------------------
   First-visit overlay explaining the site.
   Shown once (stored in localStorage as "welcome-seen").
   Editorial magazine cover style, matches site identity.
   ═══════════════════════════════════════════════════════════ */

const STORAGE_KEY = "welcome-seen";

export default function WelcomeOnboarding() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
      const timer = window.setTimeout(() => setOpen(true), 900);
      return () => window.clearTimeout(timer);
    } catch {
      /* ignore */
    }
  }, []);

  /* Lock body scroll while open */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!mounted || !open) return null;

  return (
    <div
      className="welcome-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div
        className="welcome-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="welcome-card">
        {/* ── Masthead ── */}
        <header className="welcome-masthead">
          <span className="welcome-masthead-left">
            VOL.&nbsp;01&nbsp;—&nbsp;WELCOME
          </span>
          <span className="welcome-masthead-mark" aria-hidden="true">
            ا
          </span>
          <span className="welcome-masthead-right">PORTFOLIO&nbsp;·&nbsp;۱۴۰۵</span>
        </header>

        {/* ── Title ── */}
        <div className="welcome-hero">
          <span className="welcome-eyebrow">
            AMIRHOSSEIN&nbsp;SHERKAEI
          </span>
          <h2 id="welcome-title" className="welcome-title">
            به پورتفولیو
            <br />
            <span className="welcome-title-em">خوش آمدی.</span>
          </h2>
          <p className="welcome-subtitle">
            اینجا کارهای امیرحسین شرکائی رو می‌بینی — از پروژه‌های منتخب
            تا مسیر شروع همکاری. یک نگاه سریع به ۴ بخش اصلی سایت:
          </p>
        </div>

        {/* ── Chapters ── */}
        <ul className="welcome-chapters">
          <li className="welcome-chapter">
            <span className="welcome-chapter-num">01</span>
            <div className="welcome-chapter-body">
              <h3 className="welcome-chapter-title">طراحی اختصاصی</h3>
              <p className="welcome-chapter-text">
                هر سایت از صفر طراحی می‌شود — بدون قالب آماده.
              </p>
            </div>
          </li>

          <li className="welcome-chapter">
            <span className="welcome-chapter-num">02</span>
            <div className="welcome-chapter-body">
              <h3 className="welcome-chapter-title">نمونه‌کارها</h3>
              <p className="welcome-chapter-text">
                ۴ پروژه‌ی منتخب با مطالعه‌ی موردی کامل.
              </p>
            </div>
          </li>

          <li className="welcome-chapter">
            <span className="welcome-chapter-num">03</span>
            <div className="welcome-chapter-body">
              <h3 className="welcome-chapter-title">خدمات</h3>
              <p className="welcome-chapter-text">
                وب، فرانت‌اند، هوش مصنوعی، تبلیغات و ویدیو.
              </p>
            </div>
          </li>

          <li className="welcome-chapter">
            <span className="welcome-chapter-num">04</span>
            <div className="welcome-chapter-body">
              <h3 className="welcome-chapter-title">شروع پروژه</h3>
              <p className="welcome-chapter-text">
                فرم ساده، پاسخ حداکثر ۲۴ ساعته.
              </p>
            </div>
          </li>
        </ul>

        {/* ── Footer ── */}
        <footer className="welcome-footer">
          <button
            type="button"
            className="button button-primary welcome-cta"
            onClick={handleClose}
          >
            بزن بریم
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="welcome-skip"
            onClick={handleClose}
          >
            بعداً می‌بینم
          </button>
        </footer>
      </div>
    </div>
  );
}
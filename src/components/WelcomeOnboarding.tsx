"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "welcome-seen";

const STEPS = [
  {
    id: "welcome",
    num: "01",
    eyebrow: "WELCOME",
    title: "به پورتفولیو",
    titleEm: "خوش آمدی.",
    subtitle:
      "اینجا کارهای امیرحسین شرکائی رو می‌بینی — طراحی و توسعه‌ی وب‌سایت‌های اختصاصی با کمک هوش مصنوعی.",
  },
  {
    id: "how",
    num: "02",
    eyebrow: "HOW IT WORKS",
    title: "سه قدم ساده",
    titleEm: "تا پروژه‌ی تو.",
    subtitle: "فرآیند شفاف از اولین پیام تا تحویل نهایی.",
    items: [
      {
        num: "01",
        title: "ایده‌ات را بفرست",
        text: "فرم ساده‌ی شروع پروژه — چند خط کافیه.",
      },
      {
        num: "02",
        title: "بررسی و پیشنهاد",
        text: "حداکثر ۲۴ ساعت بعد، طرح و زمان‌بندی را می‌فرستم.",
      },
      {
        num: "03",
        title: "شروع همکاری",
        text: "با تأیید تو، پروژه شروع می‌شود و مرحله‌به‌مرحله پیش می‌ره.",
      },
    ],
  },
  {
    id: "explore",
    num: "03",
    eyebrow: "EXPLORE",
    title: "چهار بخش",
    titleEm: "اصلی سایت.",
    subtitle: "هر بخش را می‌توانی از منوی بالا یا پایین ببینی.",
    items: [
      {
        num: "01",
        title: "نمونه‌کارها",
        text: "۴ پروژه‌ی منتخب با مطالعه‌ی موردی کامل.",
      },
      {
        num: "02",
        title: "خدمات",
        text: "وب، فرانت‌اند، هوش مصنوعی، تبلیغات و ویدیو.",
      },
      {
        num: "03",
        title: "درباره من",
        text: "داستان، اصول کاری و مهارت‌ها.",
      },
      {
        num: "04",
        title: "بلاگ",
        text: "مقالات درباره‌ی طراحی، فروش و تجربه‌ی کاربری.",
      },
    ],
  },
];

export default function WelcomeOnboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dir, setDir] = useState<"next" | "prev">("next");

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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const handleNext = useCallback(() => {
    setStep((current) => {
      if (current < STEPS.length - 1) {
        setDir("next");
        return current + 1;
      }
      handleClose();
      return current;
    });
  }, [handleClose]);

  const handlePrev = useCallback(() => {
    setStep((current) => {
      if (current > 0) {
        setDir("prev");
        return current - 1;
      }
      return current;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowLeft") handleNext();
      else if (e.key === "ArrowRight") handlePrev();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, handleClose, handleNext, handlePrev]);

  if (!mounted || !open) return null;

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

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
        <header className="welcome-masthead">
          <span className="welcome-masthead-left">
            VOL.&nbsp;01&nbsp;—&nbsp;GUIDE
          </span>
          <span className="welcome-masthead-mark" aria-hidden="true">
            ا
          </span>
          <span className="welcome-masthead-right">
            PORTFOLIO&nbsp;·&nbsp;۱۴۰۵
          </span>
        </header>

        {/* Progress dots */}
        <div
          className="welcome-progress"
          role="tablist"
          aria-label="مراحل معرفی"
        >
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === step}
              aria-label={`مرحله ${i + 1}`}
              className={`welcome-progress-dot ${
                i === step ? "is-active" : ""
              } ${i < step ? "is-done" : ""}`}
              onClick={() => {
                setDir(i > step ? "next" : "prev");
                setStep(i);
              }}
            />
          ))}
        </div>

        <div className="welcome-body" key={step} data-dir={dir}>
          <div className="welcome-hero">
            <span className="welcome-eyebrow">{current.eyebrow}</span>
            <h2 id="welcome-title" className="welcome-title">
              {current.title}
              <br />
              <span className="welcome-title-em">{current.titleEm}</span>
            </h2>
            <p className="welcome-subtitle">{current.subtitle}</p>
          </div>

          {current.items && (
            <ul className="welcome-chapters">
              {current.items.map((item) => (
                <li key={item.num} className="welcome-chapter">
                  <span className="welcome-chapter-num">{item.num}</span>
                  <div className="welcome-chapter-body">
                    <h3 className="welcome-chapter-title">{item.title}</h3>
                    <p className="welcome-chapter-text">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="welcome-footer">
          <div className="welcome-footer-nav">
            {!isFirst && (
              <button
                type="button"
                className="welcome-nav-btn welcome-nav-prev"
                onClick={handlePrev}
              >
                <span aria-hidden="true">→</span>
                قبلی
              </button>
            )}
            <button
              type="button"
              className="welcome-nav-btn welcome-nav-next"
              onClick={handleNext}
            >
              {isLast ? "بزن بریم" : "بعدی"}
              <span aria-hidden="true">←</span>
            </button>
          </div>
          <button
            type="button"
            className="welcome-skip"
            onClick={handleClose}
          >
            رد کردن
          </button>
        </footer>
      </div>
    </div>
  );
}
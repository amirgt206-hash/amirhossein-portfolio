"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { label: "خانه", href: "#home" },
  { label: "خدمات", href: "#services" },
  { label: "نمونه‌کارها", href: "#portfolio" },
  { label: "درباره من", href: "#about" },
  { label: "بلاگ", href: "/blog" },
];

export default function Nav() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ── Scroll state + progress ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0;
      setScrollProgress(pct);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  /* ── Active section ── */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = navItems
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target instanceof Element && visible.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const sectionItems = navItems.filter((item) => item.href.startsWith("#"));
  const activeIndex = Math.max(
    0,
    sectionItems.findIndex((item) => item.href.slice(1) === activeSection)
  );
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(sectionItems.length).padStart(2, "0");

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <div className="nav-inner">
          {/* ── Brand ── */}
          <a
            href="#home"
            className="brand"
            aria-label="امیرحسین شرکائی — Amirhossein Sherkaei"
          >
            <span className="brand-mark" aria-hidden="true">
              ا
            </span>
            <span className="brand-text">
              <strong>امیرحسین شرکائی</strong>
              <small>Amirhossein Sherkaei</small>
            </span>

            <span className="brand-issue" aria-hidden="true">
              <span className="brand-issue-sep">/</span>
              <span className="brand-issue-num">Nº 01</span>
            </span>
          </a>

          {/* ── Desktop nav ── */}
          <nav className="desktop-nav" aria-label="منوی اصلی">
            <span className="desktop-nav-label" aria-hidden="true">
              MENU
            </span>

            <div className="desktop-nav-list">
              {navItems.map((item) => {
                const isHash = item.href.startsWith("#");
                const sectionId = isHash ? item.href.slice(1) : "";
                const isActive = isHash && activeSection === sectionId;
                const className = isActive ? "active" : "";

                if (isHash) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={className}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={className}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <span
                className="desktop-nav-indicator"
                style={
                  {
                    "--nav-index": activeIndex,
                    "--nav-total": sectionItems.length,
                  } as React.CSSProperties
                }
                aria-hidden="true"
              />
            </div>

            <span className="desktop-nav-counter" aria-hidden="true">
              <span className="desktop-nav-counter-current">
                {activeNumber}
              </span>
              <span className="desktop-nav-counter-sep">/</span>
              <span className="desktop-nav-counter-total">{totalNumber}</span>
            </span>
          </nav>

          {/* ── Actions ── */}
          <div className="nav-actions">
            <Link href="/order" className="nav-order-button">
              سفارش پروژه
            </Link>

            <button
              type="button"
              className="theme-toggle"
              aria-label={
                theme === "dark"
                  ? "فعال کردن حالت روشن"
                  : "فعال کردن حالت تاریک"
              }
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              <span className="theme-toggle-inner" aria-hidden="true">
                <svg
                  className="theme-icon theme-icon-sun"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                <svg
                  className="theme-icon theme-icon-moon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll progress hairline ── */}
      <div
        className="nav-progress"
        style={{ "--nav-progress": scrollProgress } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="nav-progress-bar" />
      </div>
    </header>
  );
}
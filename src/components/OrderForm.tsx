"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import FormProgress from "@/components/FormProgress";
import { dispatchSensoryResult } from "@/components/SensoryFeedback";

const projectTypes = [
  { value: "web-custom", label: "وب‌سایت اختصاصی" },
  { value: "web-ai", label: "وب‌سایت + AI" },
  { value: "banner-ai", label: "بنر و تصاویر" },
  { value: "video-ai", label: "ویدیوی تبلیغاتی" },
  { value: "combined", label: "چند خدمت با هم" },
  { value: "other", label: "چیز دیگه" },
];

const contactMethods = [
  { value: "sms", label: "پیامک" },
  { value: "rubika", label: "روبیکا" },
  { value: "eitaa", label: "ایتا" },
];

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  businessName: string;
  personalProject: boolean;
  projectTypes: string[];
  description: string;
  contactPreference: string;
  website: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  businessName: "",
  personalProject: false,
  projectTypes: [],
  description: "",
  contactPreference: "sms",
  website: "",
};

const DRAFT_KEY = "order-form-draft";
const DESCRIPTION_MAX = 5000;
const DESCRIPTION_NEAR_LIMIT = 4500;

type ErrorField = keyof FormState | "projectTypes" | null;

/* ── Field validators ── */
const validators: Partial<Record<keyof FormState, (v: string) => boolean>> = {
  firstName: (v) => v.trim().length >= 2,
  phone: (v) => v.trim().length >= 10,
  email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  businessName: (v) => v.trim().length >= 2,
  description: (v) => v.trim().length >= 20,
};

export default function OrderForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState<ErrorField>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showStickySubmit, setShowStickySubmit] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const submitRowRef = useRef<HTMLDivElement>(null);

  /* ═══════════════════════════════════════════════════════════
     Detect mobile viewport
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 720px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ═══════════════════════════════════════════════════════════
     Load draft from localStorage
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm({ ...initialForm, ...parsed });
        setHasDraft(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════
     Auto-save draft
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (status !== "idle") return;
    try {
      const hasContent = Object.entries(form).some(([key, value]) => {
        if (key === "contactPreference") return false;
        if (key === "personalProject") return value;
        if (key === "projectTypes") return (value as string[]).length > 0;
        if (key === "website") return false;
        return typeof value === "string" && value.trim() !== "";
      });
      if (hasContent) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      }
    } catch {
      /* ignore */
    }
  }, [form, status]);

  /* ═══════════════════════════════════════════════════════════
     Sticky submit visibility
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!isMobile) return;
    const target = submitRowRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickySubmit(!entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [isMobile]);

  /* ═══════════════════════════════════════════════════════════
     Clear error when user types
     ═══════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
      setErrorField(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  /* ═══════════════════════════════════════════════════════════
     Progress calculation
     ═══════════════════════════════════════════════════════════ */
  const progress = useMemo(() => {
    let filled = 0;
    const total = 6;

    if (form.firstName.trim().length >= 2) filled += 1;
    if (form.phone.trim().length >= 10) filled += 1;
    if (form.personalProject || form.businessName.trim().length >= 2)
      filled += 1;
    if (form.projectTypes.length > 0) filled += 1;
    if (form.description.trim().length >= 20) filled += 1;
    if (form.contactPreference) filled += 1;

    return Math.round((filled / total) * 100);
  }, [form]);

  /* ═══════════════════════════════════════════════════════════
     Field state for inline validation
     ═══════════════════════════════════════════════════════════ */
  const getFieldState = (
    field: keyof FormState
  ): "idle" | "success" | "error" => {
    if (!touched[field]) return "idle";
    const validator = validators[field];
    if (!validator) return "idle";
    return validator(form[field] as string) ? "success" : "error";
  };

  const markTouched = (field: string) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  /* ═══════════════════════════════════════════════════════════
     Field updates
     ═══════════════════════════════════════════════════════════ */
  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleProjectType = (value: string) => {
    setForm((current) => {
      const exists = current.projectTypes.includes(value);
      return {
        ...current,
        projectTypes: exists
          ? current.projectTypes.filter((item) => item !== value)
          : [...current.projectTypes, value],
      };
    });
  };

  /* ═══════════════════════════════════════════════════════════
     Scroll to error field
     ═══════════════════════════════════════════════════════════ */
  const scrollToError = (field: ErrorField) => {
    if (!field) return;
    window.setTimeout(() => {
      const formEl = formRef.current;
      if (!formEl) return;
      const el = formEl.querySelector<HTMLElement>(
        `[data-field="${field}"]`
      );
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top - 120;
      window.scrollTo({ top: absoluteTop, behavior: "smooth" });
      window.setTimeout(() => {
        const focusable = el.matches("input, textarea")
          ? (el as HTMLInputElement | HTMLTextAreaElement)
          : el.querySelector<HTMLElement>("input, textarea, [tabindex]");
        focusable?.focus({ preventScroll: true });
      }, 500);
    }, 50);
  };

  const showError = (message: string, field: ErrorField) => {
    setErrorMessage(message);
    setErrorField(field);
    scrollToError(field);
  };

  /* ═══════════════════════════════════════════════════════════
     Submit handler
     ═══════════════════════════════════════════════════════════ */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setErrorMessage("");
    setErrorField(null);

    /* Mark all required fields as touched */
    setTouched({
      firstName: true,
      phone: true,
      businessName: true,
      description: true,
    });

    /* Honeypot — silent success */
    if (form.website.trim()) {
      setStatus("success");
      setForm(initialForm);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      dispatchSensoryResult("success");
      return;
    }

    /* Validation */
    if (!validators.firstName!(form.firstName)) {
      showError(
        "اسمت رو بنویس تا بدونم با کی صحبت می‌کنم.",
        "firstName"
      );
      return;
    }

    if (!validators.phone!(form.phone)) {
      showError(
        "شماره موبایل لازمه تا بتونم باهات تماس بگیرم.",
        "phone"
      );
      return;
    }

    if (
      !form.personalProject &&
      !validators.businessName!(form.businessName)
    ) {
      showError(
        "نام کسب‌وکار رو بنویس، یا گزینه‌ی «پروژه شخصی» رو تیک بزن.",
        "businessName"
      );
      return;
    }

    if (form.projectTypes.length === 0) {
      showError("حداقل یک نوع پروژه رو انتخاب کن.", "projectTypes");
      return;
    }

    if (!validators.description!(form.description)) {
      showError(
        "چند خط درباره‌ی پروژه بنویس — حتی خلاصه و بدون جزئیات.",
        "description"
      );
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/project-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          businessName: form.businessName.trim(),
          personalProject: form.personalProject,
          projectTypes: form.projectTypes,
          description: form.description.trim(),
          contactPreference: form.contactPreference,
          website: form.website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setErrorMessage(
            data.message ||
              "کمی زیادی سریع فرستادی. چند دقیقه دیگه دوباره تلاش کن."
          );
        } else {
          setErrorMessage(
            data.message ||
              "ارسال نشد. یک بار دیگه امتحان کن، اگر باز هم نشد بهم پیام بده."
          );
        }
        setStatus("error");
        dispatchSensoryResult("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
      setTouched({});
      setHasDraft(false);
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      dispatchSensoryResult("success");
    } catch (error) {
      console.error("Order form error:", error);
      setStatus("error");
      setErrorMessage(
        "اتصال برقرار نشد. اینترنتت رو چک کن یا یک بار دیگه امتحان کن."
      );
      dispatchSensoryResult("error");
    }
  };

  /* ═══════════════════════════════════════════════════════════
     Clear draft
     ═══════════════════════════════════════════════════════════ */
  const clearDraft = () => {
    setForm(initialForm);
    setTouched({});
    setHasDraft(false);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  };

  /* ═══════════════════════════════════════════════════════════
     SUCCESS STATE
     ═══════════════════════════════════════════════════════════ */
  if (status === "success") {
    return (
      <div className="order-success" role="status">
        <div className="order-success-icon" aria-hidden="true">
          ✓
        </div>

        <span className="eyebrow">درخواست دریافت شد</span>

        <h2>ممنون — پیامت به دستم رسید.</h2>

        <p>
          حداکثر ۲۴ ساعت دیگه از طریق روشی که انتخاب کردی باهات
          تماس می‌گیرم. اگر تا اون موقع سؤالی داشتی، می‌تونی از فرم
          زیر دوباره پیام بفرستی.
        </p>

        <div className="order-success-actions">
          <Link href="/" className="button button-primary">
            بازگشت به صفحه اصلی
            <span aria-hidden="true">←</span>
          </Link>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setStatus("idle");
              setErrorMessage("");
              setErrorField(null);
              setTouched({});
            }}
          >
            ارسال درخواست جدید
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     FORM
     ═══════════════════════════════════════════════════════════ */
  const descLength = form.description.length;
  const counterClass =
    descLength > DESCRIPTION_MAX
      ? "is-over-limit"
      : descLength > DESCRIPTION_NEAR_LIMIT
      ? "is-near-limit"
      : "";

  return (
    <>
      <form
        ref={formRef}
        className="order-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <FormProgress progress={progress} />

        {hasDraft && (
          <div className="order-draft-notice" role="status">
            <span className="order-draft-notice-text">
              پیش‌نویس قبلی بازیابی شد
            </span>
            <button
              type="button"
              className="order-draft-clear"
              onClick={clearDraft}
              aria-label="پاک کردن پیش‌نویس"
            >
              پاک کن
            </button>
          </div>
        )}

        {/* ═══════ Section 01 — Contact ═══════ */}
        <div className="form-section">
          <div className="form-section-heading">
            <span>01</span>
            <div>
              <h2>درباره‌ی تو</h2>
              <p>اول بگو با کی صحبت می‌کنم و چطور تماس بگیرم.</p>
            </div>
          </div>

          <div className="form-grid">
            <label
              className="form-field"
              data-field="firstName"
              data-state={getFieldState("firstName")}
            >
              <span>
                نام <b aria-hidden="true">*</b>
              </span>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                onBlur={() => markTouched("firstName")}
                autoComplete="given-name"
                inputMode="text"
                enterKeyHint="next"
                maxLength={80}
                placeholder="علی"
                aria-invalid={errorField === "firstName"}
              />
            </label>

            <label className="form-field" data-field="lastName">
              <span>نام خانوادگی</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                autoComplete="family-name"
                inputMode="text"
                enterKeyHint="next"
                maxLength={80}
                placeholder="رضایی"
              />
            </label>

            <label
              className="form-field"
              data-field="phone"
              data-state={getFieldState("phone")}
            >
              <span>
                شماره موبایل <b aria-hidden="true">*</b>
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                onBlur={() => markTouched("phone")}
                autoComplete="tel"
                inputMode="tel"
                enterKeyHint="next"
                maxLength={40}
                placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                dir="ltr"
                aria-invalid={errorField === "phone"}
              />
            </label>

            <label
              className="form-field"
              data-field="email"
              data-state={getFieldState("email")}
            >
              <span>ایمیل</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                onBlur={() => markTouched("email")}
                autoComplete="email"
                inputMode="email"
                enterKeyHint="next"
                maxLength={160}
                placeholder="you@example.com"
                dir="ltr"
              />
            </label>
          </div>
        </div>

        {/* ═══════ Section 02 — Project ═══════ */}
        <div className="form-section">
          <div className="form-section-heading">
            <span>02</span>
            <div>
              <h2>درباره‌ی پروژه</h2>
              <p>چند خط توضیح بده تا بفهمم دقیقاً چی می‌خوای بسازی.</p>
            </div>
          </div>

          <div className="form-grid">
            <label
              className="form-field form-field-full"
              data-field="businessName"
              data-state={
                form.personalProject
                  ? "idle"
                  : getFieldState("businessName")
              }
            >
              <span>
                نام کسب‌وکار <b aria-hidden="true">*</b>
              </span>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) =>
                  updateField("businessName", e.target.value)
                }
                onBlur={() => markTouched("businessName")}
                disabled={form.personalProject}
                autoComplete="organization"
                inputMode="text"
                enterKeyHint="next"
                maxLength={160}
                placeholder="مثلاً: کافه نیلا، آموزشگاه ویرا، ..."
                aria-invalid={errorField === "businessName"}
              />
            </label>

            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={form.personalProject}
                onChange={(e) =>
                  updateField("personalProject", e.target.checked)
                }
              />
              <span>این یک پروژه‌ی شخصیه، نه کسب‌وکار</span>
            </label>

            <fieldset
              className="form-fieldset form-field-full"
              data-field="projectTypes"
              aria-invalid={errorField === "projectTypes"}
            >
              <legend>
                چه نوع پروژه‌ای داری؟ <b aria-hidden="true">*</b>
              </legend>
              <p
                className="field-hint"
                style={{ marginBottom: "14px", marginTop: "-4px" }}
              >
                می‌تونی چند تا رو با هم انتخاب کنی.
              </p>

              <div className="project-type-grid">
                {projectTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`project-type-option ${
                      form.projectTypes.includes(type.value)
                        ? "is-selected"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.projectTypes.includes(type.value)}
                      onChange={() => toggleProjectType(type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label
              className="form-field form-field-full"
              data-field="description"
              data-state={getFieldState("description")}
            >
              <span>
                توضیحات پروژه <b aria-hidden="true">*</b>
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                onBlur={() => markTouched("description")}
                rows={7}
                maxLength={DESCRIPTION_MAX}
                inputMode="text"
                placeholder="مثلاً: می‌خوام یه فروشگاه آنلاین برای لباس زنانه بسازم. حدود ۵۰ محصول دارم، رنگ و سایز هم مهمه..."
                aria-invalid={errorField === "description"}
              />
              <span
                className="field-hint"
                style={{ marginTop: "8px" }}
              >
                حتی چند خط کافیه — لازم نیست کامل باشه.
              </span>
              {descLength > 0 && (
                <span className={`form-field-counter ${counterClass}`}>
                  {descLength.toLocaleString("fa-IR")} /{" "}
                  {DESCRIPTION_MAX.toLocaleString("fa-IR")}
                </span>
              )}
            </label>
          </div>
        </div>

        {/* ═══════ Section 03 — Contact method ═══════ */}
        <div className="form-section">
          <div className="form-section-heading">
            <span>03</span>
            <div>
              <h2>چطور جوابت رو بدم؟</h2>
              <p>روشی که راحت‌تری رو انتخاب کن.</p>
            </div>
          </div>

          <fieldset className="form-fieldset">
            <legend>روش تماس ترجیحی</legend>

            <div className="contact-methods">
              {contactMethods.map((method) => (
                <label
                  key={method.value}
                  className={`contact-method ${
                    form.contactPreference === method.value
                      ? "is-selected"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="contactPreference"
                    value={method.value}
                    checked={form.contactPreference === method.value}
                    onChange={(e) =>
                      updateField("contactPreference", e.target.value)
                    }
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="form-honeypot"
        />

        {/* Error message */}
        {errorMessage && (
          <div className="form-message form-message-error" role="alert">
            {errorMessage}
          </div>
        )}

        {/* Submit row */}
        <div className="form-submit-row" ref={submitRowRef}>
          <p>بعد از ارسال، حداکثر ۲۴ ساعت دیگه جواب می‌گیری.</p>

          <button
            type="submit"
            className="button button-primary"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "داره ارسال می‌شه..."
              : "ارسال و شروع گفت‌وگو"}
            <span aria-hidden="true">←</span>
          </button>
        </div>
      </form>

      {/* Mobile sticky submit */}
      {isMobile && showStickySubmit && (
        <div
          className="order-sticky-submit"
          role="region"
          aria-label="ارسال سریع"
        >
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              const formEl = formRef.current;
              if (!formEl) return;
              formEl.requestSubmit();
            }}
            disabled={status === "sending"}
          >
            {status === "sending"
              ? "داره ارسال می‌شه..."
              : "ارسال درخواست"}
            <span aria-hidden="true">←</span>
          </button>
        </div>
      )}
    </>
  );
}
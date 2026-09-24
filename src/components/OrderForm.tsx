"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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

export default function OrderForm() {
  const [form, setForm] = useState<FormState>(initialForm);

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "sending") return;

    setErrorMessage("");

    /* Honeypot */
    if (form.website.trim()) {
      setStatus("success");
      setForm(initialForm);
      return;
    }

    /* Validation سمت کلاینت (برای UX سریع‌تر) */
    if (!form.firstName.trim()) {
      setErrorMessage("اسمت رو بنویس تا بدونم با کی صحبت می‌کنم.");
      return;
    }

    if (!form.phone.trim()) {
      setErrorMessage(
        "شماره موبایل لازمه تا بتونم باهات تماس بگیرم."
      );
      return;
    }

    if (!form.personalProject && !form.businessName.trim()) {
      setErrorMessage(
        "نام کسب‌وکار رو بنویس، یا گزینه‌ی «پروژه شخصی» رو تیک بزن."
      );
      return;
    }

    if (form.projectTypes.length === 0) {
      setErrorMessage("حداقل یک نوع پروژه رو انتخاب کن.");
      return;
    }

    if (!form.description.trim()) {
      setErrorMessage(
        "چند خط درباره‌ی پروژه بنویس — حتی خلاصه و بدون جزئیات."
      );
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/project-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error("Order form error:", error);
      setStatus("error");
      setErrorMessage(
        "اتصال برقرار نشد. اینترنتت رو چک کن یا یک بار دیگه امتحان کن."
      );
    }
  };

  /* ── Success state ── */
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
            }}
          >
            ارسال درخواست جدید
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <form className="order-form" onSubmit={handleSubmit} noValidate>
      {/* Section 01: Contact info */}
      <div className="form-section">
        <div className="form-section-heading">
          <span>01</span>
          <div>
            <h2>درباره‌ی تو</h2>
            <p>اول بگو با کی صحبت می‌کنم و چطور تماس بگیرم.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>
              نام <b aria-hidden="true">*</b>
            </span>
            <input
              type="text"
              value={form.firstName}
              onChange={(event) =>
                updateField("firstName", event.target.value)
              }
              autoComplete="given-name"
              maxLength={80}
              placeholder="علی"
            />
          </label>

          <label className="form-field">
            <span>نام خانوادگی</span>
            <input
              type="text"
              value={form.lastName}
              onChange={(event) =>
                updateField("lastName", event.target.value)
              }
              autoComplete="family-name"
              maxLength={80}
              placeholder="رضایی"
            />
          </label>

          <label className="form-field">
            <span>
              شماره موبایل <b aria-hidden="true">*</b>
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                updateField("phone", event.target.value)
              }
              autoComplete="tel"
              inputMode="tel"
              maxLength={40}
              placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
              dir="ltr"
            />
          </label>

          <label className="form-field">
            <span>ایمیل</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                updateField("email", event.target.value)
              }
              autoComplete="email"
              maxLength={160}
              placeholder="you@example.com"
              dir="ltr"
            />
          </label>
        </div>
      </div>

      {/* Section 02: About project */}
      <div className="form-section">
        <div className="form-section-heading">
          <span>02</span>
          <div>
            <h2>درباره‌ی پروژه</h2>
            <p>
              چند خط توضیح بده تا بفهمم دقیقاً چی می‌خوای بسازی.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label className="form-field form-field-full">
            <span>
              نام کسب‌وکار <b aria-hidden="true">*</b>
            </span>
            <input
              type="text"
              value={form.businessName}
              onChange={(event) =>
                updateField("businessName", event.target.value)
              }
              disabled={form.personalProject}
              maxLength={160}
              placeholder="مثلاً: کافه نیلا، آموزشگاه ویرا، ..."
            />
          </label>

          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={form.personalProject}
              onChange={(event) =>
                updateField("personalProject", event.target.checked)
              }
            />
            <span>
              این یک پروژه‌ی شخصیه، نه کسب‌وکار
            </span>
          </label>

          <fieldset className="form-fieldset form-field-full">
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

          <label className="form-field form-field-full">
            <span>
              توضیحات پروژه <b aria-hidden="true">*</b>
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={7}
              maxLength={5000}
              placeholder="مثلاً: می‌خوام یه فروشگاه آنلاین برای لباس زنانه بسازم. حدود ۵۰ محصول دارم، رنگ و سایز هم مهمه. اولش فقط می‌خوام ببینم چه شکلی می‌شه، بعد کامل می‌کنم."
            />
            <span
              className="field-hint"
              style={{ marginTop: "8px" }}
            >
              حتی چند خط کافیه — لازم نیست کامل باشه. با هم جزئیات
              رو مشخص می‌کنیم.
            </span>
          </label>
        </div>
      </div>

      {/* Section 03: Contact method */}
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
                  onChange={(event) =>
                    updateField("contactPreference", event.target.value)
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
        onChange={(event) => updateField("website", event.target.value)}
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

      {/* Submit */}
      <div className="form-submit-row">
        <p>
          بعد از ارسال، حداکثر ۲۴ ساعت دیگه جواب می‌گیری.
        </p>

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
  );
}
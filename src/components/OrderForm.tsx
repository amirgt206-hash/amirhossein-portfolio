"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";

const projectTypes = [
  { value: "web-custom", label: "طراحی و توسعه وب‌سایت اختصاصی" },
  { value: "web-ai", label: "طراحی وب‌سایت با کمک هوش مصنوعی" },
  { value: "banner-ai", label: "بنر و تصاویر تبلیغاتی با هوش مصنوعی" },
  { value: "video-ai", label: "ویدیوی تبلیغاتی با هوش مصنوعی" },
  { value: "combined", label: "ترکیبی از چند خدمت" },
  { value: "other", label: "سایر" },
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

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

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

    /* Validation */
    if (!form.firstName.trim()) {
      setErrorMessage("لطفاً نام خود را وارد کنید.");
      return;
    }

    if (!form.phone.trim()) {
      setErrorMessage("لطفاً شماره موبایل خود را وارد کنید.");
      return;
    }

    if (!form.personalProject && !form.businessName.trim()) {
      setErrorMessage(
        "لطفاً نام کسب‌وکار را وارد کنید یا پروژه شخصی را انتخاب کنید."
      );
      return;
    }

    if (form.projectTypes.length === 0) {
      setErrorMessage("لطفاً حداقل یک نوع پروژه را انتخاب کنید.");
      return;
    }

    if (!form.description.trim()) {
      setErrorMessage("لطفاً توضیحات پروژه را وارد کنید.");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus("error");
      setErrorMessage(
        "تنظیمات ارسال ایمیل کامل نیست. لطفاً تنظیمات EmailJS را بررسی کنید."
      );
      return;
    }

    setStatus("sending");

    try {
      const selectedProjectTypes = form.projectTypes
        .map((value) => {
          const projectType = projectTypes.find(
            (type) => type.value === value
          );
          return projectType?.label || value;
        })
        .join("، ");

      const selectedContactMethod =
        contactMethods.find(
          (method) => method.value === form.contactPreference
        )?.label || form.contactPreference;

      const templateParams = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim() || "وارد نشده",
        phone: form.phone.trim(),
        email: form.email.trim() || "وارد نشده",
        business_name: form.personalProject
          ? "پروژه شخصی"
          : form.businessName.trim(),
        personal_project: form.personalProject ? "بله" : "خیر",
        project_types: selectedProjectTypes,
        description: form.description.trim(),
        contact_preference: selectedContactMethod,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
      });

      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
      setErrorMessage(
        "ارسال درخواست انجام نشد. لطفاً چند لحظه بعد دوباره تلاش کنید."
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

        <span className="eyebrow">درخواست ارسال شد</span>

        <h2>ممنونم، درخواستت با موفقیت ثبت شد.</h2>

        <p>
          اطلاعات پروژه دریافت شد و برای بررسی ارسال شده است. در اولین
          فرصت از طریق روش ارتباطی انتخاب‌شده با شما تماس گرفته می‌شود.
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
            <h2>اطلاعات شما</h2>
            <p>برای شروع، اطلاعات تماس خود را وارد کنید.</p>
          </div>
        </div>

        <div className="form-grid">
          <label className="form-field">
            <span>
              نام <b>*</b>
            </span>
            <input
              type="text"
              value={form.firstName}
              onChange={(event) =>
                updateField("firstName", event.target.value)
              }
              autoComplete="given-name"
              maxLength={80}
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
            />
          </label>

          <label className="form-field">
            <span>
              شماره موبایل <b>*</b>
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
            />
          </label>
        </div>
      </div>

      {/* Section 02: About project */}
      <div className="form-section">
        <div className="form-section-heading">
          <span>02</span>
          <div>
            <h2>درباره پروژه</h2>
            <p>
              کمی درباره کسب‌وکار و چیزی که می‌خواهید بسازید بگویید.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label className="form-field form-field-full">
            <span>
              نام کسب‌وکار <b>*</b>
            </span>
            <input
              type="text"
              value={form.businessName}
              onChange={(event) =>
                updateField("businessName", event.target.value)
              }
              disabled={form.personalProject}
              maxLength={160}
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
            <span>این یک پروژه شخصی است</span>
          </label>

          <fieldset className="form-fieldset form-field-full">
            <legend>
              نوع پروژه <b>*</b>
            </legend>

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
              توضیحات پروژه <b>*</b>
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={7}
              maxLength={5000}
              placeholder="هدف پروژه، امکانات موردنیاز، سبک موردنظر یا هر توضیحی که فکر می‌کنید مهم است..."
            />
          </label>
        </div>
      </div>

      {/* Section 03: Contact method */}
      <div className="form-section">
        <div className="form-section-heading">
          <span>03</span>
          <div>
            <h2>روش ارتباط</h2>
            <p>ترجیح می‌دهید پاسخ را از چه طریقی دریافت کنید؟</p>
          </div>
        </div>

        <fieldset className="form-fieldset">
          <legend>روش ارتباط ترجیحی</legend>

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
          با ارسال این فرم، اطلاعات پروژه برای بررسی اولیه ارسال می‌شود.
        </p>

        <button
          type="submit"
          className="button button-primary"
          disabled={status === "sending"}
        >
          {status === "sending"
            ? "در حال ارسال..."
            : "ارسال درخواست پروژه"}

          <span aria-hidden="true">←</span>
        </button>
      </div>
    </form>
  );
}
import type { ProjectRequestData } from "@/lib/validation";

const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

export async function sendProjectRequestEmail(
  data: ProjectRequestData
) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Email configuration is incomplete.");
  }

  if (!privateKey) {
    throw new Error("EmailJS private key is missing.");
  }

  const fullName = [data.firstName, data.lastName]
    .filter(Boolean)
    .join(" ");

  const projectTypes = data.projectTypes.join("، ");

  const templateParams = {
    /* ─── پارامترهای اصلی ─── */
    first_name: data.firstName,
    last_name: data.lastName || "وارد نشده",
    phone: data.phone,
    email: data.email || "وارد نشده",
    business_name: data.personalProject
      ? "پروژه شخصی"
      : data.businessName,
    personal_project: data.personalProject ? "بله" : "خیر",
    project_types: projectTypes,
    description: data.description,
    contact_preference: data.contactPreference,

    /* ─── نام کامل (برای راحتی) ─── */
    full_name: fullName,

    /* ─── پارامترهای اضافی رایج ─── */
    from_name: fullName,
    reply_to: data.email || data.phone,
    subject: `درخواست پروژه جدید — ${fullName}`,
    message: data.description,
  };

  const response = await fetch(EMAILJS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `EmailJS error (${response.status}): ${errorText}`
    );
  }
}
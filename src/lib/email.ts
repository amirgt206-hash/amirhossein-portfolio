import nodemailer from "nodemailer";
import type { ProjectRequestData } from "@/lib/validation";

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: smtpPort,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendProjectRequestEmail(
  data: ProjectRequestData
) {
  const destination = process.env.PROJECT_CONTACT_EMAIL;
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!destination || !sender) {
    throw new Error("Email configuration is incomplete.");
  }

  const fullName = [data.firstName, data.lastName]
    .filter(Boolean)
    .join(" ");

  const projectTypes = data.projectTypes.join("، ");

  const text = `
درخواست پروژه جدید

نام: ${fullName}
شماره موبایل: ${data.phone}
ایمیل: ${data.email || "وارد نشده"}
نام کسب‌وکار: ${
    data.personalProject ? "پروژه شخصی" : data.businessName
  }

نوع پروژه:
${projectTypes}

روش ارتباط ترجیحی: ${data.contactPreference}

توضیحات پروژه:
${data.description}
`;

  await transporter.sendMail({
    from: sender,
    to: destination,
    subject: `درخواست پروژه جدید - ${fullName}`,
    text,
  });
}
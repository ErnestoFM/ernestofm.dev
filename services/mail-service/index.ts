import nodemailer from 'nodemailer';

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Create a reusable nodemailer transporter
 */
function createTransporter() {
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  // Fallback SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send a contact form email
 * @param data ContactEmailData from the contact form
 */
export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const transporter = createTransporter();
  const from = process.env.MAIL_FROM || 'contact@ernestofm.dev';
  const to = process.env.MAIL_TO || 'hello@ernestofm.dev';

  await transporter.sendMail({
    from: `"Portfolio Contact" <${from}>`,
    to,
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
    text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
    `.trim(),
    html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">New Contact Form Submission</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; font-weight: bold; background: #f5f5f5;">Name</td>
      <td style="padding: 8px;">${data.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; background: #f5f5f5;">Email</td>
      <td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; background: #f5f5f5;">Subject</td>
      <td style="padding: 8px;">${data.subject}</td>
    </tr>
  </table>
  <div style="margin-top: 16px; padding: 16px; background: #f9f9f9; border-left: 4px solid #0070f3;">
    <p style="margin: 0; white-space: pre-wrap;">${data.message.replace(/\n/g, '<br/>')}</p>
  </div>
</div>
    `.trim(),
  });
}

import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_GMAIL_EMAIL,
        pass: process.env.MY_GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Blog Notify" <${process.env.MY_GMAIL_EMAIL}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

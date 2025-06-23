import nodemailer from 'nodemailer';

// Create transporter directly for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Must be App Password if 2FA is on
  },
});

// Utility to send email
const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  const fromEmail = process.env.FROM_EMAIL || process.env.GMAIL_USER || 'noreply@yourdomain.com';

  const mailOptions = {
    from: `"FK CRM" <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (email: string, verificationLink: string) => {
  const html = `
    <div>
      <h1>FK CRM</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Verify Your Email - FK CRM',
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, userName: string) => {
  const html = `
    <div>
      <h1>Welcome ${userName}!</h1>
      <p>Your FK CRM account has been created.</p>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to FK CRM!',
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetCode: string,
  userName?: string
) => {
  const html = `
    <div>
      <h1>Hello ${userName || 'there'}!</h1>
      <p>Your FK CRM password reset code is:</p>
      <h2>${resetCode}</h2>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset Code - FK CRM',
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

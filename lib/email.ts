import nodemailer from 'nodemailer';

// Email provider configurations
export const emailProviders = {
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  },
  outlook: {
    service: 'outlook',
    auth: {
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  },
  resend: {
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  },
  mailgun: {
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASSWORD,
    },
  },
};

// Get the configured email provider
const getEmailProvider = () => {
  const provider = process.env.EMAIL_PROVIDER || 'gmail';
  return emailProviders[provider as keyof typeof emailProviders] || emailProviders.gmail;
};

// Create transporter
const createTransporter = () => {
  const config = getEmailProvider();
  return nodemailer.createTransport(config);
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetCode: string,
  userName?: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.FROM_EMAIL || process.env.GMAIL_USER || 'noreply@yourdomain.com';

    const mailOptions = {
      from: `"FK CRM" <${fromEmail}>`,
      to: email,
      subject: 'Password Reset Code - FK CRM',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">FK CRM</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${userName || 'there'}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password for your FK CRM account. 
              Use the following 6-digit code to complete your password reset:
            </p>
            
            <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h1 style="color: #667eea; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 0;">
                ${resetCode}
              </h1>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              This code will expire in 10 minutes for security reasons.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Notice:</strong> If you didn't request this password reset, 
                please ignore this email or contact our support team immediately.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px;">
              Best regards,<br>
              The FK CRM Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.FROM_EMAIL || process.env.GMAIL_USER || 'noreply@yourdomain.com';

    const mailOptions = {
      from: `"FK CRM" <${fromEmail}>`,
      to: email,
      subject: 'Welcome to FK CRM!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">FK CRM</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Welcome aboard!</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Welcome, ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for joining FK CRM! We're excited to help you streamline your student management process.
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="color: #155724; margin: 0; font-size: 14px;">
                <strong>Your account has been successfully created!</strong> You can now log in and start managing your student applications.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px;">
              If you have any questions, feel free to reach out to our support team.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-top: 25px;">
              Best regards,<br>
              The FK CRM Team
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}; 
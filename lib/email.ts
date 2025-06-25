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
  // Fallback for custom SMTP
  custom: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
};

// Get the configured email provider
const getEmailProvider = () => {
  const provider = process.env.EMAIL_PROVIDER || 'gmail';
  return emailProviders[provider as keyof typeof emailProviders] || emailProviders.gmail;
};

// Create transporter with fallback for development
const createTransporter = () => {
  console.log('🔧 Creating email transporter...');
  console.log('📧 Email provider:', process.env.EMAIL_PROVIDER || 'gmail');
  
  // Check if any email credentials are configured
  const hasCredentials = Object.values(emailProviders).some(config => {
    if ('auth' in config) {
      const hasUser = !!config.auth.user;
      const hasPass = !!config.auth.pass;
      console.log(`🔑 Checking email provider - User: ${hasUser}, Pass: ${hasPass}`);
      return hasUser && hasPass;
    }
    return false;
  });

  console.log('✅ Has credentials:', hasCredentials);

  if (!hasCredentials) {
    console.warn('📧 No email credentials configured. Email sending will be simulated in development.');
    
    // For development, create a test account or use ethereal email
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Using ethereal email for development...');
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'test@ethereal.email',
          pass: 'test123',
        },
      });
    }
    
    // Return null if no credentials and not in development
    return null;
  }

  const config = getEmailProvider();
  console.log('�� Using email config for provider:', process.env.EMAIL_PROVIDER || 'gmail');
  console.log('📧 Config has auth:', !!config.auth);
  console.log('📧 Auth user configured:', !!config.auth?.user);
  
  try {
    const transporter = nodemailer.createTransport(config);
    console.log('✅ Email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    throw error;
  }
};

// Get from email address
const getFromEmail = () => {
  return process.env.FROM_EMAIL || 
         process.env.GMAIL_USER || 
         process.env.SMTP_USER || 
         'noreply@fk-crm.com';
};

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"FK CRM" <${getFromEmail()}>`,
    to: email,
    subject: 'Verify your email address - FK CRM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">FK CRM</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with FK CRM! To complete your registration, please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;
                      font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="color: #667eea; word-break: break-all; margin-bottom: 20px; font-size: 14px;">
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Important:</strong> This verification link will expire in 24 hours. 
              If you didn't create an account with FK CRM, you can safely ignore this email.
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

  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      // In development without email config, just log the verification URL
      console.log('📧 Verification email would be sent to:', email);
      console.log('🔗 Verification URL:', verificationUrl);
      console.log('📧 Email content:', mailOptions);
      return;
    }

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully to:', email);
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    
    // In development, log the verification URL for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 For testing, use this verification URL:', verificationUrl);
    }
    
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetCode: string) {
  
  const mailOptions = {
    from: `"FK CRM" <${getFromEmail()}>`,
    to: email,
    subject: 'Password Reset Code - FK CRM',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">FK CRM</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${name}!</h2>
          
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

  try {
    console.log('🔧 Creating email transporter...');
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('⚠️ No email transporter available - simulating email send');
      console.log('📧 Password reset email would be sent to:', email);
      console.log('🔢 Reset Code:', resetCode);
      console.log('📧 From email:', getFromEmail());
      return;
    }

    console.log('📧 Sending email...');
    console.log('📧 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Subject:', mailOptions.subject);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully to:', email);
    console.log('📧 Message ID:', result.messageId);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
    // In development, log the reset code for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔢 For testing, use this reset code:', resetCode);
      console.log('📧 Email would have been sent from:', getFromEmail());
    }
    
    // Re-throw the error with more context
    throw new Error(`Failed to send password reset email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Send welcome email
export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<boolean> => {
  console.log('📧 Starting welcome email process...');
  console.log('📧 To:', email);
  console.log('👤 User Name:', userName);
  
  try {
    console.log('🔧 Creating email transporter...');
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('⚠️ No email transporter available - simulating welcome email send');
      console.log('📧 Welcome email would be sent to:', email);
      console.log('📧 From email:', getFromEmail());
      return true;
    }

    const mailOptions = {
      from: `"FK CRM" <${getFromEmail()}>`,
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

    console.log('📧 Sending welcome email...');
    console.log('📧 From:', mailOptions.from);
    console.log('📧 To:', mailOptions.to);
    console.log('📧 Subject:', mailOptions.subject);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully to:', email);
    console.log('📧 Message ID:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
    // In development, log additional info
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would have been sent from:', getFromEmail());
    }
    
    return false;
  }
};
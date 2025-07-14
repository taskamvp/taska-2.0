import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, userType } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory (in production, you'd use Redis or database)
    // For now, we'll use a simple in-memory store
    if (!global.otpStore) {
      global.otpStore = new Map();
    }
    
    // Store OTP with expiration (5 minutes)
    global.otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      userType
    });

    // Create email content based on user type
    const userTypeText = userType === 'student' ? 'Student' : 'Employer';
    const subject = `Verify your email - Taska ${userTypeText} Account`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Taska</title>
        <style>
          body {
            font-family: 'Montserrat', 'Manrope', 'Poppins', 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #111 0%, #333 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .otp-container {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            display: inline-block;
          }
          .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #111;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
          }
          .message {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 20px;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e9ecef;
          }
          .highlight {
            color: #facc15;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Email Verification</h1>
          </div>
          <div class="content">
            <p class="message">
              Hi there! 👋<br>
              Welcome to <span class="highlight">Taska</span>! We're excited to have you join our platform as a <strong>${userTypeText}</strong>.
            </p>
            <p class="message">
              To complete your registration, please enter the following verification code:
            </p>
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
            </div>
            <p class="message">
              This code will expire in <strong>5 minutes</strong> for security reasons.
            </p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              Never share this code with anyone. Taska will never ask for this code via phone, email, or any other method.
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Taska Elite. All rights reserved.</p>
            <p>If you didn't create an account, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Taska <noreply@taska.com>',
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }

    console.log('OTP sent successfully to:', email);
    return res.status(200).json({ 
      success: true, 
      message: 'Verification email sent successfully',
      email: email 
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
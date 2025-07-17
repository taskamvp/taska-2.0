export default async function handler(req, res) {
  console.log('Welcome email API called with:', { method: req.method, body: req.body });
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, userType, userName } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  console.log('Email sending attempt:', { email, userType, userName, hasApiKey: !!apiKey });

  if (!apiKey) {
    console.error('Resend API key not found in environment variables');
    return res.status(500).json({ error: 'Resend API key not configured.' });
  }

  if (!email || !userType) {
    console.error('Missing required fields:', { email, userType });
    return res.status(400).json({ error: 'Email and user type are required.' });
  }

  // Function to check if email is a beta test email
  function isBetaTestEmail(email) {
    const betaEmails = [
      'beta1@gmail.com', 'beta2@gmail.com', 'beta3@gmail.com', 'beta4@gmail.com', 'beta5@gmail.com',
      'beta6@gmail.com', 'beta7@gmail.com', 'beta8@gmail.com', 'beta9@gmail.com', 'beta10@gmail.com'
    ];
    return betaEmails.includes(email.toLowerCase());
  }

  // Skip sending email if it's a beta test email
  if (isBetaTestEmail(email)) {
    console.log('Skipping welcome email for beta test email:', email);
    return res.status(200).json({ success: true, message: 'Email skipped for beta test account' });
  }

  const welcomeEmailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Taska!</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background:rgb(255, 255, 255);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .welcome-title {
                font-size: 24px;
                font-weight: 600;
                margin: 0;
                letter-spacing: -0.01em;
            }
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #14532d;
                margin-bottom: 20px;
            }
            .description {
                font-size: 16px;
                color: #555;
                margin-bottom: 20px;
                line-height: 1.7;
            }
            .cta-button {
                display: inline-block;
                background:rgb(167, 204, 182) !important;
                color: white !important;
                text-decoration: none !important;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 16px;
                margin: 20px 0;
                transition: background 0.2s;
                border: none !important;
                outline: none !important;
            }
            .cta-button:hover {
                background: #166534 !important;
                color: white !important;
            }
            .cta-button:visited {
                color: white !important;
            }
            .cta-button:active {
                color: white !important;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 6px;
                }
                .header {
                    padding: 25px 15px;
                }
                .content {
                    padding: 25px 15px;
                }
                .welcome-title {
                    font-size: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="welcome-title">Welcome to Taska</h1>
            </div>
            
            <div class="content">
                <h2 class="greeting">Hi ${userName || 'there'}! 👋</h2>
                
                ${userType === 'student' ? `
                    <p class="description">
                        Welcome to Taska, your platform to connect with employers for part time jobs and Gig work.
                    </p>
                    
                    <p class="description">
                        Complete your profile and add your portfolio link to showcase your work. Employers will view your profile and contact you directly for paid gigs, internships, and part-time jobs.
                    </p>
                    
                    <p class="description">
                        This is your first step toward real world experience. Let's get started.
                    </p>
                    
                    <a href="https://jointaska.com/workplace/profile.html" class="cta-button">
                        Complete Profile
                    </a>
                ` : `
                    <p class="description">
                        Find affordable solutions for your projects and connect with top talent from leading institutions.
                    </p>
                    
                    <p class="description">
                        Discover skilled candidates from premier colleges like IITs, NITs, and other top universities. Whether you're looking for short term tasks, interns, or part time assistance, Taska helps you reach the right people quickly and efficiently.
                    </p>
                    
                    <p class="description">
                        Find the right talent for your needs using our AI powered search and connect with them to start working.
                    </p>
                    
                    <a href="https://jointaska.com/professional/profile.html" class="cta-button">
                        Complete Profile
                    </a>
                `}
            </div>
            
            <div class="footer">
                <p>Team Taska</p>
                <p style="margin-top: 10px; font-size: 12px; color: #999;">
                    This email was sent to ${email}. If you didn't sign up for Taska, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    console.log('Sending email to Resend API...');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Welcome to Taska! 🎓`,
        html: welcomeEmailHTML,
        from: 'onboarding@jointaska.com',
      }),
    });

    const data = await response.json();
    console.log('Resend API response:', { status: response.status, data });
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.error || 'Failed to send welcome email');
    }
    
    console.log('Welcome email sent successfully to:', email);
    res.status(200).json({ success: true, message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: error.message });
  }
} 
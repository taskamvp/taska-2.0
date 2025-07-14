export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, userType, userName } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured.' });
  }

  if (!email || !userType) {
    return res.status(400).json({ error: 'Email and user type are required.' });
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
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f8f9fa;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #14532d 0%, #166534 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }
            .logo {
                width: 80px;
                height: 80px;
                background: white;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                font-weight: bold;
                color: #14532d;
            }
            .welcome-title {
                font-size: 28px;
                font-weight: 700;
                margin: 0 0 10px 0;
                letter-spacing: -0.02em;
            }
            .welcome-subtitle {
                font-size: 16px;
                opacity: 0.9;
                margin: 0;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 20px;
                font-weight: 600;
                color: #14532d;
                margin-bottom: 20px;
            }
            .description {
                font-size: 16px;
                color: #666;
                margin-bottom: 25px;
                line-height: 1.7;
            }
            .features {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 25px 0;
            }
            .features h3 {
                color: #14532d;
                font-size: 18px;
                margin: 0 0 15px 0;
                font-weight: 600;
            }
            .feature-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .feature-list li {
                padding: 8px 0;
                color: #555;
                position: relative;
                padding-left: 25px;
            }
            .feature-list li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #14532d;
                font-weight: bold;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #14532d, #166534);
                color: white;
                text-decoration: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 25px 0;
                transition: all 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(20, 83, 45, 0.3);
            }
            .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                color: #14532d;
                text-decoration: none;
                margin: 0 10px;
                font-weight: 500;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 8px;
                }
                .header {
                    padding: 30px 20px;
                }
                .content {
                    padding: 30px 20px;
                }
                .welcome-title {
                    font-size: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">T</div>
                <h1 class="welcome-title">Welcome to Taska!</h1>
                <p class="welcome-subtitle">Your gateway to elite talent and opportunities</p>
            </div>
            
            <div class="content">
                <h2 class="greeting">Hi ${userName || 'there'}! 👋</h2>
                
                <p class="description">
                    Welcome to Taska! You've just joined a community that connects ${userType === 'professional' ? 'skilled students with amazing opportunities' : 'elite talent with exciting projects'}.
                </p>
                
                <div class="features">
                    <h3>What is Taska?</h3>
                    <p style="margin-bottom: 15px; color: #555;">
                        Taska is a platform that bridges the gap between talented students and professionals seeking skilled individuals for their projects.
                    </p>
                    
                    <ul class="feature-list">
                        <li>AI-powered talent matching</li>
                        <li>Direct connection with verified students</li>
                        <li>Secure project collaboration</li>
                        <li>Professional networking opportunities</li>
                        <li>Quality-focused community</li>
                    </ul>
                </div>
                
                <p class="description">
                    ${userType === 'professional' 
                        ? 'Start exploring our talented student community and find the perfect match for your next project!' 
                        : 'Complete your profile to showcase your skills and start receiving exciting project opportunities!'
                    }
                </p>
                
                <a href="https://taska.com" class="cta-button">
                    ${userType === 'professional' ? 'Explore Talent' : 'Complete Profile'}
                </a>
            </div>
            
            <div class="footer">
                <p>© 2025 Taska Elite. All rights reserved.</p>
                <div class="social-links">
                    <a href="#">Privacy Policy</a> • 
                    <a href="#">Terms of Service</a> • 
                    <a href="#">Support</a>
                </div>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                    This email was sent to ${email}. If you didn't sign up for Taska, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Welcome to Taska! 🎉`,
        html: welcomeEmailHTML,
        from: 'Taska <noreply@taska.com>', // Update this to your verified domain
      }),
    });

    const data = await response.json();
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
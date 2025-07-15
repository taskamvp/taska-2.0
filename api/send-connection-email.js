export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { studentEmail, studentName, professionalEmail, professionalName } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured.' });
  }

  if (!studentEmail || !studentName || !professionalEmail || !professionalName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const connectionEmailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Connection Request - Taska</title>
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
                background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .title {
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
                color: #1a73e8;
                margin-bottom: 20px;
            }
            .description {
                font-size: 16px;
                color: #555;
                margin-bottom: 20px;
                line-height: 1.7;
            }
            .highlight {
                background: #e8f0fe;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #1a73e8;
                margin: 20px 0;
            }
            .cta-button {
                display: inline-block;
                background: #1a73e8 !important;
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
                background: #1557b0 !important;
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
                .title {
                    font-size: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">New Connection Request</h1>
            </div>
            
            <div class="content">
                <h2 class="greeting">Hi ${studentName}! 👋</h2>
                
                <p class="description">
                    Great news! <strong>${professionalName}</strong> wants to connect with you on Taska.
                </p>
                
                <div class="highlight">
                    <strong>Employer Details:</strong><br>
                    Name: ${professionalName}<br>
                    Email: ${professionalEmail}
                </div>
                
                <p class="description">
                    This could be your opportunity to work on exciting projects, internships, or part-time roles. 
                    Don't miss out on this connection!
                </p>
                
                <p class="description">
                    Click the button below to view and manage your connections:
                </p>
                
                <a href="https://jointaska.com/workplace/tasks.html" class="cta-button">
                    View Connections
                </a>
                
                <p class="description" style="font-size: 14px; color: #666; margin-top: 20px;">
                    You can accept or decline this connection request from your Taska dashboard.
                </p>
            </div>
            
            <div class="footer">
                <p>Team Taska</p>
                <p style="margin-top: 10px; font-size: 12px; color: #999;">
                    This email was sent to ${studentEmail}. If you didn't expect this connection request, please ignore this email.
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
        to: studentEmail,
        subject: `New Connection Request from ${professionalName} - Taska`,
        html: connectionEmailHTML,
        from: 'Taska <support@jointaska.com>',
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send connection email');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Connection email sending error:', error);
    res.status(500).json({ error: error.message });
  }
} 
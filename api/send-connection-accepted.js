export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, employerName, studentName } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured.' });
  }

  if (!to || !studentName) {
    return res.status(400).json({ error: 'Recipient email (to) and studentName are required.' });
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
  if (isBetaTestEmail(to)) {
    console.log('Skipping connection accepted email for beta test email:', to);
    return res.status(200).json({ success: true, message: 'Email skipped for beta test account' });
  }

  const subject = 'Connection Accepted on Taska';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.07);padding:32px 24px;">
      <h2 style="color:#1a73e8;font-size:1.3rem;margin-bottom:18px;">Connection Accepted on Taska</h2>
      <p style="font-size:1.08rem;color:#222;">Hi ${employerName || 'Employer'},</p>
      <p style="font-size:1.08rem;color:#222;"><b>${studentName}</b> has accepted your connection request on <b>Taska</b>! You can now start giving tasks and collaborate together.</p>
      <div style="margin:32px 0;text-align:center;">
        <a href="https://jointaska.com/professional/tasks.html" style="display:inline-block;padding:12px 28px;background:#1a73e8;color:#fff;border-radius:6px;font-weight:600;text-decoration:none;font-size:1.08rem;">View Connection</a>
      </div>
      <p style="font-size:0.98rem;color:#666;">If you did not expect this, you can safely ignore this email.</p>
      <p style="font-size:0.95rem;color:#aaa;margin-top:32px;">&copy; 2025 Taska</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        from: 'Taska <support@jointaska.com>',
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send email');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Connection accepted email error:', error);
    res.status(500).json({ error: error.message });
  }
} 
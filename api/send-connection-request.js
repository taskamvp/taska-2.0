export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, studentName } = req.body;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key not configured.' });
  }

  if (!to) {
    return res.status(400).json({ error: 'Recipient email (to) is required.' });
  }

  const subject = 'An employer wants to connect with you on Taska';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.07);padding:32px 24px;">
      <h2 style="color:#1a73e8;font-size:1.3rem;margin-bottom:18px;">Connection Request on Taska</h2>
      <p style="font-size:1.08rem;color:#222;">Hi ${studentName || 'Student'},</p>
      <p style="font-size:1.08rem;color:#222;">An employer wants to connect with you on <b>Taska</b>! You can view and manage your connections by clicking the button below.</p>
      <div style="margin:32px 0;text-align:center;">
        <a href="https://jointaska.com/workplace/tasks.html" style="display:inline-block;padding:12px 28px;background:#1a73e8;color:#fff;border-radius:6px;font-weight:600;text-decoration:none;font-size:1.08rem;">View Connections</a>
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
    console.error('Connection request email error:', error);
    res.status(500).json({ error: error.message });
  }
} 
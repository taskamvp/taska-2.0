export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    // Check if OTP store exists
    if (!global.otpStore) {
      return res.status(400).json({ error: 'No OTP found for this email' });
    }

    // Get stored OTP data
    const storedData = global.otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({ error: 'No OTP found for this email' });
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      global.otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
    }

    // OTP is valid - remove it from store and return success
    global.otpStore.delete(email);

    console.log('OTP verified successfully for:', email);
    return res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully',
      email: email,
      userType: storedData.userType
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
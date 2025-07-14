// send-test-email.js
const { Resend } = require('resend');

const resend = new Resend('re_ShttCEKU_4Cq5W1qVybe6BUWbEprLLLFq');

async function main() {
  try {
    const data = await resend.emails.send({
      from: 'support@jointaska.com', // or your verified sender
      to: 'faazill2005@gmail.com',    // change to your email
      subject: 'Hello from Resend!',
      html: '<strong>This is a test email sent using Resend API.</strong>',
    });
    console.log('Email sent:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main();

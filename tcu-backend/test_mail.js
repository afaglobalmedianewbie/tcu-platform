const nodemailer = require('nodemailer');

async function testMail() {
  try {
    // Create a transporter using local Postfix
    let transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: 25,
      secure: false, // TLS requires port 465 or 587
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send mail
    let info = await transporter.sendMail({
      from: '"TCU Platform" <admin@topclassuniversal.co.id>', 
      to: 'test@example.com', // Testing target
      subject: 'Test Email from TCU Platform',
      text: 'Hello world? This is a test email sent from the local Postfix mail server.',
      html: '<b>Hello!</b><br>This is a test email sent from the local Postfix mail server.'
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

testMail();

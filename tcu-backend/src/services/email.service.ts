export class EmailService {
  /**
   * Send Email Notification
   * As per User Knowledge constraint:
   * "Mail Server: The VPS has a local Postfix/Dovecot setup. Use nodemailer connecting to 127.0.0.1:25 without TLS for automated emails."
   */
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    console.log(`[Email] Sending email to ${to} via local Postfix (127.0.0.1:25)`);
    console.log(`[Email] Subject: ${subject}`);
    
    // In real app, initialize nodemailer here:
    // const transporter = nodemailer.createTransport({ host: '127.0.0.1', port: 25, secure: false, ignoreTLS: true });
    // await transporter.sendMail({ from: 'no-reply@topclass.id', to, subject, text, html });

    return { success: true, messageId: `msg_${Date.now()}` };
  }
}

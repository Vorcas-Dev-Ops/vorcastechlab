import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  try {
    // Create a generic SMTP transport with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: process.env.MAIL_PORT || 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: process.env.MAIL_USER || 'support@vorcastechlab.com',
        pass: process.env.MAIL_PASS 
      }
    });

    const mailOptions = {
      from: email,
      to: 'support@vorcastechlab.com',
      subject: `New Project Request - ${service}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service Type: ${service}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
          <h1 style="color: #fb6a09;">New Project Quote Request</h1>
          <p>You have received a new inquiry from the Vorcas Website.</p>
          <hr />
          <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Service:</strong> <span style="color: #fb6a09;">${service}</span></li>
          </ul>
          <div style="margin-top: 20px; background: #fff; padding: 15px; border-radius: 8px;">
            <strong>Message:</strong><br />
            ${message.replace(/\n/g, '<br />')}
          </div>
        </div>
      `
    };

    // If MAIL_PASS is not set, we'll log it instead of failing (for development)
    if (!process.env.MAIL_PASS) {
      console.log('--- EMAIL MOCKED ---');
      console.log('To: support@vorcastechlab.com');
      console.log('Subject:', mailOptions.subject);
      console.log('Content:', mailOptions.text);
      return res.status(200).json({ success: true, message: 'Message recorded successfully (Dev Mode - Email Mocked)' });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Your message has been sent successfully!' });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

export default router;

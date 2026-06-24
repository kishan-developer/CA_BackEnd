function contactUserTemplate({ name, message }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Thank You for Contacting VyaparSewa</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .logo-section {
          background-color: #ffffff;
          padding: 30px;
          text-align: center;
          border-bottom: 2px solid #2663eb;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #2663eb;
          margin: 0;
          letter-spacing: 1px;
        }
        .logo-icon {
          display: inline-block;
          margin-right: 10px;
        }
        .header {
          background: linear-gradient(135deg, #2663eb 0%, #1a56d2 100%);
          color: #ffffff;
          padding: 25px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .message-box {
          background-color: #f8f9fa;
          border-left: 4px solid #2663eb;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .message-label {
          font-weight: bold;
          color: #555;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
        }
        .message-content {
          font-style: italic;
          color: #666;
          line-height: 1.6;
        }
        .info-text {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .footer {
          background-color: #0F172A;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        .footer a {
          color: #2663eb;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <h2 class="logo">
            <span class="logo-icon">🏢</span>VyaparSewa
          </h2>
        </div>
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
        </div>
        <div class="content">
          <p class="greeting">Dear ${name},</p>
          
          <p class="info-text">
            Thank you for reaching out to VyaparSewa! We have successfully received your inquiry and our team will review it shortly.
          </p>
          
          <div class="message-box">
            <div class="message-label">Your Message:</div>
            <div class="message-content">"${message}"</div>
          </div>
          
          <p class="info-text">
            Our team typically responds within 24-48 business hours. If your matter is urgent, please feel free to contact us directly at:
          </p>
          
          <p class="info-text">
            <strong>Email:</strong> gunnikij1665@gmail.com<br>
            <strong>Phone:</strong> +91 7398290340
          </p>
          
          <p class="info-text">
            We appreciate your interest in VyaparSewa and look forward to assisting you with your business needs.
          </p>
          
          <p class="info-text">
            Best regards,<br>
            <strong>The VyaparSewa Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>© 2026 VyaparSewa. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = contactUserTemplate;

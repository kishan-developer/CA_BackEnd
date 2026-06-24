function contactAdminTemplate({ name, email, phone, message }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>New Contact Inquiry - VyaparSewa</title>
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
          padding: 25px 30px;
          text-align: center;
          border-bottom: 2px solid #0F172A;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #0F172A;
          margin: 0;
          letter-spacing: 1px;
        }
        .logo-icon {
          display: inline-block;
          margin-right: 10px;
        }
        .header {
          background: linear-gradient(135deg, #0F172A 0%, #1e293b 100%);
          color: #ffffff;
          padding: 25px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: bold;
        }
        .header .subtitle {
          margin-top: 8px;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .alert {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .alert-text {
          color: #856404;
          font-weight: bold;
          margin: 0;
        }
        .info-section {
          margin-bottom: 25px;
        }
        .info-label {
          font-weight: bold;
          color: #555;
          margin-bottom: 8px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          color: #333;
          font-size: 16px;
          border: 1px solid #e9ecef;
        }
        .message-section {
          background-color: #f0f9ff;
          border: 1px solid #bae6fd;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .message-label {
          font-weight: bold;
          color: #0369a1;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
        }
        .message-content {
          color: #0c4a6e;
          line-height: 1.6;
          font-style: italic;
        }
        .action-section {
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 20px;
          border-radius: 5px;
          margin-top: 25px;
        }
        .action-title {
          font-weight: bold;
          color: #047857;
          margin-bottom: 10px;
          font-size: 14px;
          text-transform: uppercase;
        }
        .action-text {
          color: #065f46;
          line-height: 1.6;
        }
        .footer {
          background-color: #0F172A;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        .timestamp {
          color: #999;
          font-size: 12px;
          text-align: right;
          margin-top: 20px;
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
          <h1>🔔 New Contact Inquiry</h1>
          <div class="subtitle">VyaparSewa Website Contact Form</div>
        </div>
        
        <div class="content">
          <div class="alert">
            <p class="alert-text">⚠️ Action Required: A new contact form submission needs your attention</p>
          </div>
          
          <div class="info-section">
            <div class="info-label">👤 Customer Name</div>
            <div class="info-value">${name}</div>
          </div>
          
          <div class="info-section">
            <div class="info-label">📧 Email Address</div>
            <div class="info-value">
              <a href="mailto:${email}" style="color: #2663eb; text-decoration: none;">${email}</a>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-label">📱 Phone Number</div>
            <div class="info-value">${phone || 'Not provided'}</div>
          </div>
          
          <div class="message-section">
            <div class="message-label">💬 Customer Message</div>
            <div class="message-content">"${message}"</div>
          </div>
          
          <div class="action-section">
            <div class="action-title">📋 Recommended Actions</div>
            <div class="action-text">
              1. Review the customer's inquiry<br>
              2. Respond to the customer within 24-48 hours<br>
              3. Log the interaction in your CRM system<br>
              4. Follow up if additional information is needed
            </div>
          </div>
          
          <div class="timestamp">
            Submitted on: ${new Date().toLocaleString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        <div class="footer">
          <p>© 2026 VyaparSewa - Admin Notification System</p>
          <p>This is an automated message from the VyaparSewa contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = contactAdminTemplate;

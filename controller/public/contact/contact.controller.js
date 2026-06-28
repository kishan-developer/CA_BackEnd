const Contact = require("../../../model/Contact.model");
const Notification = require("../../../model/Notification.model");
const nodemailer = require("nodemailer");
const contactUserTemplate = require("../../../email/template/contactUserTemplate");
const contactAdminTemplate = require("../../../email/template/contactAdminTemplate");

// @desc   Submit Service Quick Inquiry
// @route  POST /api/service-inquiry
const submitServiceInquiry = async (req, res) => {
  try {
    const { name, email, phone, serviceName, message } = req.body;

    if (!name || !email || !phone || !serviceName || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone, serviceName, message) are required",
      });
    }

    // Create a contact entry for the service inquiry
    const newContact = await Contact.create({
      name,
      email,
      phone,
      service: serviceName,
      city: 'Not specified',
      message,
    });

    // Send confirmation email to user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const userEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Service Inquiry Received - VyaparSewa</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { color: #2663eb; font-size: 24px; margin-bottom: 20px; text-align: center; }
          p { color: #333; line-height: 1.6; margin-bottom: 15px; }
          strong { color: #2663eb; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Service Inquiry Received</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your inquiry about <strong>${serviceName}</strong>. We have received your request and our team will contact you shortly with detailed information.</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Your Message:</strong> ${message}</p>
          <p>Our team will reach out to you at <strong>${email}</strong> or <strong>${phone}</strong> within 24-48 hours to discuss your requirements.</p>
          <p>Regards,<br/>The VyaparSewa Team</p>
          <div class="footer">
            This is an automated message from VyaparSewa.
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Service Inquiry - VyaparSewa</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { color: #2663eb; font-size: 24px; margin-bottom: 20px; text-align: center; }
          p { color: #333; line-height: 1.6; margin-bottom: 15px; }
          strong { color: #2663eb; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Service Inquiry</h2>
          <p>A new service inquiry has been received:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p>Please contact the client to provide more information about the service.</p>
          <div class="footer">
            This is an automated message from VyaparSewa.
          </div>
        </div>
      </body>
      </html>
    `;

    // User Email
    const userMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Service Inquiry Received - ${serviceName} - VyaparSewa`,
      html: userEmailTemplate,
    };

    // Admin Email
    const adminMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `🔔 New Service Inquiry - ${serviceName} - VyaparSewa`,
        html: adminEmailTemplate,
      };

    transporter.sendMail(userMailOptions, (err) => {
      if (err) console.log("User Email failed:", err);
    });

    transporter.sendMail(adminMailOptions, (err) => {
        if (err) console.log("Admin Email failed:", err);
    });

    res.status(201).json({
      success: true,
      message: "Service inquiry submitted successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 🌐 PUBLIC CONTROLLERS
// ===========================

// @desc   Submit Contact Form
// @route  POST /api/contact
const submitContactForm = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      companyName, 
      businessType, 
      gstin, 
      pan, 
      annualTurnover, 
      service, 
      city, 
      urgency, 
      preferredContact, 
      message, 
      userId 
    } = req.body;

    if (!name || !email || !phone || !service || !city || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields (name, email, phone, service, city, message) are missing",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      companyName,
      businessType,
      gstin,
      pan,
      annualTurnover,
      service,
      city,
      urgency,
      preferredContact,
      message,
      formType: 'contact'
    });

    // Create Dashboard Notification if userId exists
    if (userId) {
        try {
            await Notification.create({
                userId,
                title: "Inquiry Submitted",
                message: "We've received your inquiry and will contact you shortly.",
                type: "general"
            });
        } catch (notifErr) {
            console.log("Contact notification failed:", notifErr);
        }
    }

    // ===========================
    // 📧 EMAIL NOTIFICATIONS
    // ===========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // User Email Template
    const userEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thank You for Contacting VyaparSewa</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { color: #2663eb; font-size: 24px; margin-bottom: 20px; text-align: center; }
          p { color: #333; line-height: 1.6; margin-bottom: 15px; }
          strong { color: #2663eb; }
          .info-box { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Thank You for Contacting VyaparSewa</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We have received your inquiry and our team will contact you shortly with detailed information about your requirements.</p>
          
          <div class="info-box">
            <p><strong>Service Category:</strong> ${service}</p>
            <p><strong>City:</strong> ${city}</p>
            ${urgency ? `<p><strong>Urgency:</strong> ${urgency}</p>` : ''}
            ${preferredContact ? `<p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>` : ''}
          </div>
          
          <p><strong>Your Message:</strong> ${message}</p>
          ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
          ${businessType ? `<p><strong>Business Type:</strong> ${businessType}</p>` : ''}
          
          <p>Our team will reach out to you at <strong>${email}</strong> or <strong>${phone}</strong> within 24-48 hours to discuss your requirements.</p>
          <p>Regards,<br/>The VyaparSewa Team</p>
          <div class="footer">
            This is an automated message from VyaparSewa.
          </div>
        </div>
      </body>
      </html>
    `;

    // Admin Email Template
    const adminEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Contact Inquiry - VyaparSewa</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { color: #2663eb; font-size: 24px; margin-bottom: 20px; text-align: center; }
          p { color: #333; line-height: 1.6; margin-bottom: 15px; }
          strong { color: #2663eb; }
          .info-box { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔔 New Contact Inquiry</h2>
          <p>A new contact inquiry has been received:</p>
          
          <div class="info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>City:</strong> ${city}</p>
            ${urgency ? `<p><strong>Urgency:</strong> ${urgency}</p>` : ''}
            ${preferredContact ? `<p><strong>Preferred Contact:</strong> ${preferredContact}</p>` : ''}
          </div>
          
          ${companyName ? `<p><strong>Company Name:</strong> ${companyName}</p>` : ''}
          ${businessType ? `<p><strong>Business Type:</strong> ${businessType}</p>` : ''}
          ${gstin ? `<p><strong>GSTIN:</strong> ${gstin}</p>` : ''}
          ${pan ? `<p><strong>PAN:</strong> ${pan}</p>` : ''}
          ${annualTurnover ? `<p><strong>Annual Turnover:</strong> ${annualTurnover}</p>` : ''}
          
          <p><strong>Message:</strong> ${message}</p>
          
          <p>Please contact the client to provide more information about the service.</p>
          <div class="footer">
            This is an automated message from VyaparSewa.
          </div>
        </div>
      </body>
      </html>
    `;

    // User Email
    const userMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Thank You for Contacting VyaparSewa",
      html: userEmailTemplate,
    };

    // Admin Email
    const adminMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `🔔 New Contact Inquiry from ${name} - VyaparSewa`,
        html: adminEmailTemplate,
    };

    transporter.sendMail(userMailOptions, (err) => {
      if (err) console.log("User Email failed:", err);
    });

    transporter.sendMail(adminMailOptions, (err) => {
        if (err) console.log("Admin Email failed:", err);
    });

    res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      data: newContact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===========================
// 🛠 ADMIN CONTROLLERS
// ===========================

// @desc   Get all contact messages
// @route  GET /api/admin/contact
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete all contact messages
// @route  DELETE /api/contact
const deleteAllMessages = async (req, res) => {
  try {
    await Contact.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All messages deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitServiceInquiry,
  submitContactForm,
  getAllMessages,
  deleteAllMessages,
};
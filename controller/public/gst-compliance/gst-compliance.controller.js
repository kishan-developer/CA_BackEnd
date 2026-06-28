const GSTCompliance = require("../../../model/GSTCompliance.model");
const nodemailer = require("nodemailer");

// @desc   Submit GST Compliance Form
// @route  POST /api/gst-compliance
const submitGSTComplianceForm = async (req, res) => {
  try {
    const {
      // Contact Information
      name,
      phone,
      email,
      businessName,
      city,
      state,
      preferredContactMethod,
      
      // GST Registration Details
      gstinNumber,
      legalBusinessName,
      tradeName,
      panNumber,
      businessType,
      gstRegistrationState,
      principalPlaceOfBusiness,
      natureOfBusiness,
      
      // GST Compliance Services
      services,
      
      // Plan Information
      planTitle,
      planPrice
    } = req.body;

    if (!name || !phone || !email || !businessName || !city || !state || 
        !gstinNumber || !legalBusinessName || !tradeName || !panNumber || 
        !businessType || !gstRegistrationState || !principalPlaceOfBusiness || 
        !natureOfBusiness || !services || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newGSTCompliance = await GSTCompliance.create({
      name,
      phone,
      email,
      businessName,
      city,
      state,
      preferredContactMethod,
      gstinNumber,
      legalBusinessName,
      tradeName,
      panNumber,
      businessType,
      gstRegistrationState,
      principalPlaceOfBusiness,
      natureOfBusiness,
      services,
      planTitle,
      planPrice,
      formType: 'gst_compliance'
    });

    // Email Setup
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
        <title>GST Compliance Request Received - VyaparSewa</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { color: #2663eb; font-size: 24px; margin-bottom: 20px; text-align: center; }
          p { color: #333; line-height: 1.6; margin-bottom: 15px; }
          strong { color: #2663eb; }
          .info-box { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .service-list { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>GST Compliance Request Received</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your GST Compliance request. We have received your submission and our team will review your requirements.</p>
          
          <div class="info-box">
            <p><strong>Business Name:</strong> ${businessName}</p>
            <p><strong>GSTIN:</strong> ${gstinNumber}</p>
            <p><strong>PAN:</strong> ${panNumber}</p>
            <p><strong>Business Type:</strong> ${businessType}</p>
            ${planTitle ? `<p><strong>Plan:</strong> ${planTitle} (${planPrice})</p>` : ''}
          </div>
          
          <p><strong>Services Requested:</strong></p>
          <div class="service-list">
            ${services.map(service => `<p>• ${service}</p>`).join('')}
          </div>
          
          <p>Our team will contact you at <strong>${email}</strong> or <strong>${phone}</strong> within 24-48 hours to discuss your GST compliance requirements.</p>
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
        <title>New GST Compliance Request - VyaparSewa</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          h2 { color: #2663eb; font-size: 24px; margin-bottom: 20px; text-align: center; }
          p { color: #333; line-height: 1.6; margin-bottom: 15px; }
          strong { color: #2663eb; }
          .info-box { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .service-list { background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { font-size: 12px; color: #777; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔔 New GST Compliance Request</h2>
          <p>A new GST compliance request has been received:</p>
          
          <div class="info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Business Name:</strong> ${businessName}</p>
            <p><strong>City:</strong> ${city}, ${state}</p>
            <p><strong>Preferred Contact:</strong> ${preferredContactMethod}</p>
          </div>
          
          <div class="info-box">
            <p><strong>GSTIN:</strong> ${gstinNumber}</p>
            <p><strong>Legal Business Name:</strong> ${legalBusinessName}</p>
            <p><strong>Trade Name:</strong> ${tradeName}</p>
            <p><strong>PAN:</strong> ${panNumber}</p>
            <p><strong>Business Type:</strong> ${businessType}</p>
            <p><strong>GST Registration State:</strong> ${gstRegistrationState}</p>
            <p><strong>Principal Place of Business:</strong> ${principalPlaceOfBusiness}</p>
            <p><strong>Nature of Business:</strong> ${natureOfBusiness}</p>
            ${planTitle ? `<p><strong>Plan:</strong> ${planTitle} (${planPrice})</p>` : ''}
          </div>
          
          <p><strong>Services Requested:</strong></p>
          <div class="service-list">
            ${services.map(service => `<p>• ${service}</p>`).join('')}
          </div>
          
          <p>Please contact the client to discuss their GST compliance requirements.</p>
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
      subject: `GST Compliance Request Received - VyaparSewa`,
      html: userEmailTemplate,
    };

    // Admin Email
    const adminMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: `🔔 New GST Compliance Request from ${name} - VyaparSewa`,
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
      message: "GST Compliance request submitted successfully",
      data: newGSTCompliance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all GST Compliance requests
// @route  GET /api/gst-compliance
const getAllGSTComplianceRequests = async (req, res) => {
  try {
    const requests = await GSTCompliance.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "GST Compliance requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitGSTComplianceForm,
  getAllGSTComplianceRequests,
};

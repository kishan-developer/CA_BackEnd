const ITRFiling = require("../../../model/ITRFiling.model");
const nodemailer = require("nodemailer");

// @desc   Submit ITR Filing Form
// @route  POST /api/itr-filing
const submitITRFilingForm = async (req, res) => {
  try {
    const {
      // Personal Information
      name,
      email,
      phone,
      dateOfBirth,
      fatherName,
      
      // Identity Details
      panNumber,
      aadhaarNumber,
      residentialStatus,
      
      // Address Information
      address,
      city,
      state,
      pinCode,
      
      // Plan Information
      planTitle,
      planPrice
    } = req.body;

    if (!name || !email || !phone || !dateOfBirth || !fatherName || 
        !panNumber || !aadhaarNumber || !residentialStatus || 
        !address || !city || !state || !pinCode) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newITRFiling = await ITRFiling.create({
      name,
      email,
      phone,
      dateOfBirth,
      fatherName,
      panNumber,
      aadhaarNumber,
      residentialStatus,
      address,
      city,
      state,
      pinCode,
      planTitle,
      planPrice,
      formType: 'itr_filing'
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
        <title>ITR Filing Request Received - VyaparSewa</title>
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
          <h2>ITR Filing Request Received</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for your ITR Filing request. We have received your submission and our team will review your tax filing requirements.</p>
          
          <div class="info-box">
            <p><strong>PAN Number:</strong> ${panNumber}</p>
            <p><strong>Residential Status:</strong> ${residentialStatus}</p>
            <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
            ${planTitle ? `<p><strong>Plan:</strong> ${planTitle} (${planPrice})</p>` : ''}
          </div>
          
          <p>Our team will contact you at <strong>${email}</strong> or <strong>${phone}</strong> within 24-48 hours to discuss your ITR filing requirements.</p>
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
        <title>New ITR Filing Request - VyaparSewa</title>
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
          <h2>🔔 New ITR Filing Request</h2>
          <p>A new ITR Filing request has been received:</p>
          
          <div class="info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
            <p><strong>Father's Name:</strong> ${fatherName}</p>
          </div>
          
          <div class="info-box">
            <p><strong>PAN Number:</strong> ${panNumber}</p>
            <p><strong>Aadhaar Number:</strong> ${aadhaarNumber}</p>
            <p><strong>Residential Status:</strong> ${residentialStatus}</p>
            ${planTitle ? `<p><strong>Plan:</strong> ${planTitle} (${planPrice})</p>` : ''}
          </div>
          
          <div class="info-box">
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>State:</strong> ${state}</p>
            <p><strong>PIN Code:</strong> ${pinCode}</p>
          </div>
          
          <p>Please contact the client to discuss their ITR filing requirements.</p>
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
      subject: `ITR Filing Request Received - VyaparSewa`,
      html: userEmailTemplate,
    };

    // Admin Email
    const adminMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.SMTP_EMAIL,
      subject: `🔔 New ITR Filing Request from ${name} - VyaparSewa`,
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
      message: "ITR Filing request submitted successfully",
      data: newITRFiling,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all ITR Filing requests
// @route  GET /api/itr-filing
const getAllITRFilingRequests = async (req, res) => {
  try {
    const requests = await ITRFiling.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "ITR Filing requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitITRFilingForm,
  getAllITRFilingRequests,
};

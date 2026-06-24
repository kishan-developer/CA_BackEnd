const Contact = require("../../../model/Contact.model");
const Notification = require("../../../model/Notification.model");
const nodemailer = require("nodemailer");
const contactUserTemplate = require("../../../email/template/contactUserTemplate");
const contactAdminTemplate = require("../../../email/template/contactAdminTemplate");

// ===========================
// 🌐 PUBLIC CONTROLLERS
// ===========================

// @desc   Submit Contact Form
// @route  POST /api/contact
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message, userId } = req.body;

    const newContact = await Contact.create({
      name,
      email,
      phone,
      message,
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

    // User Email
    const userMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "Thank You for Contacting CA_Web",
      html: contactUserTemplate({ name, message }),
    };

    // Admin Email
    const adminMailOptions = {
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `🔔 New Contact Inquiry from ${name} - CA_Web`,
        html: contactAdminTemplate({ name, email, phone, message }),
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
  submitContactForm,
  getAllMessages,
  deleteAllMessages,
};
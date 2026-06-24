const Newsletter = require("../../model/Newsletter.model");
const sendEmail = require("../../utils/mailSender.utils");

// =========================
//  USER SIDE CONTROLLERS
// =========================

// @desc   Subscribe to newsletter
// @route  POST /api/newsletter/subscribe
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already subscribed",
      });
    }

    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscription successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 🛠️ ADMIN SIDE CONTROLLERS
// =========================

// @desc   Get all subscribers
// @route  GET /api/newsletter/admin/list
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Subscribers fetched",
      subscribers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Send newsletter to all subscribers
// @route  POST /api/newsletter/send
const sendNewsletter = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message)
      return res.status(400).json({
        success: false,
        message: "Subject & Message are required",
      });

    const subscribers = await Newsletter.find();

    if (subscribers.length === 0)
      return res.status(400).json({
        success: false,
        message: "No subscribers found",
      });

    const emails = subscribers.map((s) => s.email);

    // Sending Email using sendEmail Utility
    await sendEmail({
      to: emails,
      subject,
      html: message,
    });

    res.status(200).json({
      success: true,
      message: "Newsletter sent successfully",
      total: emails.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Exporting controllers
module.exports = {
  subscribe,
  getSubscribers,
  sendNewsletter,
};
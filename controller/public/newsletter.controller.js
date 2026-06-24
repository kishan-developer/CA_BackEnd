
const Newsletter = require("../../model/Newsletter.model");
const sendEmail = require("../../utils/mailSender.utils");

// =========================
// 📩 USER SIDE CONTROLLERS
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


// Exporting controllers
module.exports = {
  subscribe,
  
};
const Notification = require("../../models/Notification.model");

// =========================
//       SEND NOTIFICATION
// =========================
const sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: "Title & Message required" });
    }

    const notification = await Notification.create({
      userId: userId || null,
      title,
      message,
      type: type || "general",
    });

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      notification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendNotification,
};
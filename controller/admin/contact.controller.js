
const Contact = require("../../model/Contact.model");

//======================
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

module.exports = {
  getAllMessages,
};
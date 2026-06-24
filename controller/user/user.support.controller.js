const Support = require("../../model/Support.model");

// =========================
//  USER — Create Ticket
// =========================
const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = await Support.create({
      user: req.user._id,
      subject,
      message,
      status: "open",
    });

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// USER — Get My Tickets
// =========================
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
//  ADMIN — Get All Tickets
// =========================
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.find()
      .populate("user", "name email")
      .populate("replies.admin", "name email");

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
//  ADMIN — Reply to Ticket
// =========================
const replyTicket = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.replies.push({
      admin: req.admin._id,
      reply: req.body.reply,
    });

    ticket.status = "answered";
    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
//  Close Ticket (User/Admin)
// =========================
const closeTicket = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    ticket.status = "closed";
    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket closed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTicket,
  getUserTickets,
  getAllTickets,
  replyTicket,
  closeTicket,
};
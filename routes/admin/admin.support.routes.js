const express = require("express");
const router = express.Router();

const {
  createTicket,
  getUserTickets,
  getAllTickets,
  replyTicket,
  closeTicket,
} = require("../controllers/support.controller");



// USER ROUTES
router.post("/create", createTicket);
router.get("/my-tickets", getUserTickets);

// ADMIN ROUTES
router.get("/admin/all", getAllTickets);
router.post("/reply/:id", replyTicket);

// BOTH CAN CLOSE
router.put("/close/:id", closeTicket);

module.exports = router;
const express = require("express");
const userSupportrouter = express.Router();

const {
  createTicket,
  getUserTickets,
  getAllTickets,
  replyTicket,
  closeTicket,
} = require("../../controller/user/user.support.controller");



// USER ROUTES
userSupportrouter.post("/create",  createTicket);
userSupportrouter.get("/my-tickets", getUserTickets);

// ADMIN ROUTES
userSupportrouter.get("/admin/all",  getAllTickets);
userSupportrouter.post("/reply/:id",  replyTicket);

// BOTH CAN CLOSE
userSupportrouter.put("/close/:id",  closeTicket);

module.exports = userSupportrouter;
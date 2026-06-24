const express = require("express");
const adminNewsletterrouter = express.Router();
const {
  subscribe,
  getSubscribers,
  sendNewsletter,
} = require("../../controller/admin/newsletter.controller");

// USER ROUTE
adminNewsletterrouter.post("/subscribe", subscribe);

// ADMIN ROUTES
adminNewsletterrouter.get("/admin/list", getSubscribers);
adminNewsletterrouter.post("/send", sendNewsletter);

module.exports = adminNewsletterrouter;
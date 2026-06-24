const express = require("express");
const notificationrouter = express.Router();
const {
  getUserNotifications,
  markAsRead,
  deleteNotification,
} = require("../../controller/user/user.notification.controller");

const { isAuthenticated } = require("../../middleware/auth.middleware");

// USER — Get notifications
notificationrouter.get("/", isAuthenticated, getUserNotifications);

// USER — Mark as read
notificationrouter.put("/read/:id", isAuthenticated, markAsRead);

// USER — Delete notification
notificationrouter.delete("/:id", isAuthenticated, deleteNotification);

module.exports = notificationrouter;
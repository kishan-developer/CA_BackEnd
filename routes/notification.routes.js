const express = require("express");
const router = express.Router();
const {
  sendNotificationToUser,
  sendNotificationToRole,
  sendNotificationToDepartment,
  broadcastNotification,
} = require("../config/socket");

// Send notification to specific user
router.post("/user", (req, res) => {
  const { userId, notification } = req.body;

  if (!userId || !notification) {
    return res.error("userId and notification are required", 400);
  }

  try {
    sendNotificationToUser(userId, notification);
    res.success("Notification sent successfully", { userId, notification });
  } catch (error) {
    return res.error(error.message, 500);
  }
});

// Send notification to specific role
router.post("/role", (req, res) => {
  const { role, notification } = req.body;

  if (!role || !notification) {
    return res.error("role and notification are required", 400);
  }

  try {
    sendNotificationToRole(role, notification);
    res.success("Notification sent successfully", { role, notification });
  } catch (error) {
    return res.error(error.message, 500);
  }
});

// Send notification to specific department
router.post("/department", (req, res) => {
  const { department, notification } = req.body;

  if (!department || !notification) {
    return res.error("department and notification are required", 400);
  }

  try {
    sendNotificationToDepartment(department, notification);
    res.success("Notification sent successfully", { department, notification });
  } catch (error) {
    return res.error(error.message, 500);
  }
});

// Broadcast notification to all
router.post("/broadcast", (req, res) => {
  const { notification } = req.body;

  if (!notification) {
    return res.error("notification is required", 400);
  }

  try {
    broadcastNotification(notification);
    res.success("Notification broadcast successfully", { notification });
  } catch (error) {
    return res.error(error.message, 500);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { sendNotification } = require("../../controllers/admin/admin.notification.controller");

const { isAdmin } = require("../../middlewares/auth");

// ADMIN — Send notification
router.post("/send", isAdmin, sendNotification);

module.exports = router;
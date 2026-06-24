const express = require("express");
const analyticsrouter = express.Router();
const {
  getTraffic,
  getShelterStats,
  getUserStats,
  getRevenueStats,
} = require("../../controller/admin/analytics.controller");

analyticsrouter.get("/traffic", getTraffic);       // Traffic / visitors
analyticsrouter.get("/shelters", getShelterStats); // Popular shelters
analyticsrouter.get("/users", getUserStats);       // User stats
analyticsrouter.get("/revenue", getRevenueStats);  // Revenue stats

module.exports = analyticsrouter;
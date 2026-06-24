const express = require("express");
const bannerrouter = express.Router();

const {
  addBanner,
  getBanners,
  updateBanner,
  deleteBanner,
} = require("../../controller/admin/banner.controller");

// ROUTES → /api/banners

// Add banner
bannerrouter.post("/add", addBanner);

// Get all banners
bannerrouter.get("/", getBanners);

// Update banner
bannerrouter.put("/update/:id", updateBanner);

// Delete banner
bannerrouter.delete("/:id", deleteBanner);

module.exports = bannerrouter;
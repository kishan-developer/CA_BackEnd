const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    section: {
      type: String,
      enum: ["home", "slider", "hero", "promo"],
      default: "home",
    },
    link: String,
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    homePage: {
      bannerTitle: { type: String, default: "" },
      bannerSubtitle: { type: String, default: "" },
      bannerImage: { type: String, default: "" },
      extraContent: { type: String, default: "" },
    },
    aboutPage: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      aboutImage: { type: String, default: "" },
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
    contactInfo: {
      address: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      mapEmbedUrl: { type: String, default: "" },
    },
    socialMedia: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    footerLinks: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const CMS = mongoose.model("CMS", cmsSchema);

module.exports = CMS;

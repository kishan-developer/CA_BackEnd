const express = require("express");
const {
  getCMSData,
  updateHomePage,
  updateAboutPage,
  updateSEO,
  updateContactInfo,
  updateSocialMedia,
  updateFooterLinks,
} = require("../../controller/admin/cms.controller");

const cmsrouter = express.Router();

// PUBLIC
cmsrouter.get("/data", getCMSData);

// ADMIN
cmsrouter.put("/home", updateHomePage);
cmsrouter.put("/about", updateAboutPage);
cmsrouter.put("/seo", updateSEO);
cmsrouter.put("/contact", updateContactInfo);
cmsrouter.put("/social", updateSocialMedia);
cmsrouter.put("/footer", updateFooterLinks);

module.exports = cmsrouter;
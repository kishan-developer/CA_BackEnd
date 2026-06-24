const CMS = require("../../model/CMS.model");

// ================================
//      GET ALL CMS DATA
// ================================
const getCMSData = async (req, res) => {
  try {
    let cms = await CMS.findOne(); // single document
    if (!cms) {
      cms = await CMS.create({});
    }
    res.status(200).json({
      success: true,
      message: "CMS data fetched successfully",
      data: cms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch CMS data",
      error: error.message,
    });
  }
};

// ================================
//      UPDATE HOME PAGE CONTENT
// ================================
const updateHomePage = async (req, res) => {
  try {
    const { bannerTitle, bannerSubtitle, bannerImage, extraContent } = req.body;
    const updateData = {};

    if (bannerTitle !== undefined) updateData["homePage.bannerTitle"] = bannerTitle;
    if (bannerSubtitle !== undefined) updateData["homePage.bannerSubtitle"] = bannerSubtitle;
    if (bannerImage !== undefined) updateData["homePage.bannerImage"] = bannerImage;
    if (extraContent !== undefined) updateData["homePage.extraContent"] = extraContent;

    const cms = await CMS.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Home page content updated successfully",
      data: cms.homePage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update home page content",
      error: error.message,
    });
  }
};

// ================================
//      UPDATE ABOUT PAGE CONTENT
// ================================
const updateAboutPage = async (req, res) => {
  try {
    const { title, description, mission, vision, aboutImage } = req.body;
    const updateData = {};

    if (title !== undefined) updateData["aboutPage.title"] = title;
    if (description !== undefined) updateData["aboutPage.description"] = description;
    if (mission !== undefined) updateData["aboutPage.mission"] = mission;
    if (vision !== undefined) updateData["aboutPage.vision"] = vision;
    if (aboutImage !== undefined) updateData["aboutPage.aboutImage"] = aboutImage;

    const cms = await CMS.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "About page updated successfully",
      data: cms.aboutPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update About page",
      error: error.message,
    });
  }
};

// ================================
//      UPDATE SEO CONTENT
// ================================
const updateSEO = async (req, res) => {
  try {
    const { metaTitle, metaDescription, metaKeywords, ogImage } = req.body;
    const updateData = {};

    if (metaTitle !== undefined) updateData["seo.metaTitle"] = metaTitle;
    if (metaDescription !== undefined) updateData["seo.metaDescription"] = metaDescription;
    if (metaKeywords !== undefined) updateData["seo.metaKeywords"] = metaKeywords;
    if (ogImage !== undefined) updateData["seo.ogImage"] = ogImage;

    const cms = await CMS.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "SEO updated successfully",
      data: cms.seo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update SEO details",
      error: error.message,
    });
  }
};

// ================================
//      UPDATE CONTACT INFO
// ================================
const updateContactInfo = async (req, res) => {
  try {
    const { address, phone, email, mapEmbedUrl } = req.body;
    const updateData = {};

    if (address !== undefined) updateData["contactInfo.address"] = address;
    if (phone !== undefined) updateData["contactInfo.phone"] = phone;
    if (email !== undefined) updateData["contactInfo.email"] = email;
    if (mapEmbedUrl !== undefined) updateData["contactInfo.mapEmbedUrl"] = mapEmbedUrl;

    const cms = await CMS.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Contact Info updated successfully",
      data: cms.contactInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Contact Info",
      error: error.message,
    });
  }
};

// ================================
//      UPDATE SOCIAL MEDIA
// ================================
const updateSocialMedia = async (req, res) => {
  try {
    const { facebook, twitter, instagram, linkedin } = req.body;
    const updateData = {};

    if (facebook !== undefined) updateData["socialMedia.facebook"] = facebook;
    if (twitter !== undefined) updateData["socialMedia.twitter"] = twitter;
    if (instagram !== undefined) updateData["socialMedia.instagram"] = instagram;
    if (linkedin !== undefined) updateData["socialMedia.linkedin"] = linkedin;

    const cms = await CMS.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Social Media updated successfully",
      data: cms.socialMedia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Social Media",
      error: error.message,
    });
  }
};

// ================================
//      UPDATE FOOTER LINKS
// ================================
const updateFooterLinks = async (req, res) => {
  try {
    const { footerLinks } = req.body;
    
    // Validate array
    if (!Array.isArray(footerLinks)) {
      return res.status(400).json({
        success: false,
        message: "footerLinks must be an array of objects ({ title, url })",
      });
    }

    const cms = await CMS.findOneAndUpdate(
      {},
      { $set: { footerLinks } },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Footer Links updated successfully",
      data: cms.footerLinks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Footer Links",
      error: error.message,
    });
  }
};

// EXPORT
module.exports = {
  getCMSData,
  updateHomePage,
  updateAboutPage,
  updateSEO,
  updateContactInfo,
  updateSocialMedia,
  updateFooterLinks
};
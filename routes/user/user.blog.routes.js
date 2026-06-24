const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  getSingleBlog,
  getRelatedBlogs,
  searchBlogs,
} = require("../controllers/blog.controller");

// USER ROUTES
router.get("/blogs", getAllBlogs);                  // All blogs
router.get("/blog/:slug", getSingleBlog);           // Single blog
router.get("/blogs/related/:category", getRelatedBlogs); // Related blogs
router.get("/blogs/search", searchBlogs);           // Search blogs

module.exports = router;

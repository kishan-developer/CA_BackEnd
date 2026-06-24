const express = require("express");
const router = express.Router();

const {
  addBlog,
  editBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  getRelatedBlogs,
  searchBlogs,
} = require("../../controller/admin/blog.controller");

const adminblogRouter = require("express").Router();

// ADMIN ROUTES
// Route - /api/v1/admin/blog/create
adminblogRouter.post("/create", addBlog);// Add new blog

// Route - /api/v1/admin/blog/:id
adminblogRouter.put("/:id", editBlog);// Edit blog

// Route - /api/v1/admin/blog/:id
adminblogRouter.delete("/:id", deleteBlog); // Delete blog

// Route - /api/v1/admin/blog/
adminblogRouter.get("/", getAllBlogs);// All blogs

// Route - /api/v1/admin/blog/:slug
adminblogRouter.get("/:slug", getSingleBlog);// Single blog

// Route - /api/v1/admin/blog/related/:category
adminblogRouter.get("/related/:category", getRelatedBlogs); // Related blogs

// Route - /api/v1/admin/blog/blogs/search
adminblogRouter.get("/blogs/search", searchBlogs);// Search blogs

module.exports = adminblogRouter;

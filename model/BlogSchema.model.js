const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);

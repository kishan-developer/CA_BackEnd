const Review = require("../models/review.model");
const Shelter = require("../models/Shelter.model");

// ======================================
// ⭐ ADD REVIEW (User)
// ======================================
const addReview = async (req, res) => {
  try {
    const { shelterId, ratingQuality, ratingMaintenance, ratingService, comment } = req.body;
    const userId = req.user.id;

    // Ensure shelter exists
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) {
      return res.status(404).json({ success: false, message: "Shelter not found" });
    }

    // Create review
    const review = await Review.create({
      shelterId,
      userId,
      ratingQuality,
      ratingMaintenance,
      ratingService,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ======================================
// ⭐ GET ALL REVIEWS OF A SHELTER (Public)
// ======================================
const getShelterReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ shelterId: req.params.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ======================================
// ⭐ DELETE REVIEW (Admin or User Itself)
// ======================================
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // If user trying to delete someone else’s review
    if (review.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  addReview,
  getShelterReviews,
  deleteReview,
};
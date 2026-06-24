const express = require("express");
const router = express.Router();
const { addReview, getShelterReviews, deleteReview } = require("../controller/public/review.controller");


// ROUTES → /api/reviews

//  Add Review (User)
router.post("/add", addReview);

//  Get all reviews for a shelter
router.get("/shelter/:id", getShelterReviews);

//  Delete Review (User or Admin)
router.delete("/:id", deleteReview);

module.exports = router;
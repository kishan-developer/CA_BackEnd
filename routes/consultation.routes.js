const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth.middleware");
const {
    bookConsultation,
    getMyConsultations,
    getConsultationById,
    rescheduleConsultation,
    cancelConsultation,
    updatePaymentStatus,
    submitFeedback,
    getAllConsultationsAdmin,
    updateConsultationAdmin,
    getConsultationStats,
    getMentorBookedSlots
} = require("../controller/consultation.controller");

const router = express.Router();

// Public Routes
router.get("/consultation/mentor/:mentorId/slots", getMentorBookedSlots);

// User Routes
router.post("/consultation/book", isAuthenticated, bookConsultation);
router.get("/consultation/my-bookings", isAuthenticated, getMyConsultations);
router.get("/consultation/:id", isAuthenticated, getConsultationById);
router.put("/consultation/:id/reschedule", isAuthenticated, rescheduleConsultation);
router.put("/consultation/:id/cancel", isAuthenticated, cancelConsultation);
router.put("/consultation/:id/payment", isAuthenticated, updatePaymentStatus);
router.post("/consultation/:id/feedback", isAuthenticated, submitFeedback);

// Admin Routes
router.get("/admin/consultations", isAuthenticated, isAdmin, getAllConsultationsAdmin);
router.get("/admin/consultations/stats", isAuthenticated, isAdmin, getConsultationStats);
router.put("/admin/consultations/:id", isAuthenticated, isAdmin, updateConsultationAdmin);

module.exports = router;

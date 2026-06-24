const express = require("express");
const { isAuthenticated, isAdmin } = require("../middleware/auth.middleware");
const {
    getAllServices,
    getServiceBySlug,
    getServicesByCategory,
    getAllServicesAdmin,
    getServiceById,
    createService,
    updateService,
    deleteService,
    toggleServiceActive,
    toggleServiceFeatured,
    getServiceStats,
    getCategories,
    getFeaturedServices
} = require("../controller/service.controller");

const router = express.Router();

// Public Routes
router.get("/services", getAllServices);
router.get("/services/featured", getFeaturedServices);
router.get("/services/categories", getCategories);
router.get("/services/category/:category", getServicesByCategory);
router.get("/services/:slug", getServiceBySlug);

// Admin Routes
router.get("/admin/services", isAuthenticated, isAdmin, getAllServicesAdmin);
router.get("/admin/services/stats", isAuthenticated, isAdmin, getServiceStats);
router.get("/admin/services/:id", isAuthenticated, isAdmin, getServiceById);
router.post("/admin/services", isAuthenticated, isAdmin, createService);
router.put("/admin/services/:id", isAuthenticated, isAdmin, updateService);
router.delete("/admin/services/:id", isAuthenticated, isAdmin, deleteService);
router.patch("/admin/services/:id/toggle-active", isAuthenticated, isAdmin, toggleServiceActive);
router.patch("/admin/services/:id/toggle-featured", isAuthenticated, isAdmin, toggleServiceFeatured);

module.exports = router;

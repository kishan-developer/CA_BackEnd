const express = require("express");
const { isAuthenticated, isAdmin } = require("../../middleware/auth.middleware");
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserPassword,
    updateOwnProfile,
    changeOwnPassword,
    getOwnProfile,
    deactivateUser,
    activateUser,
    getUserStats
} = require("../../controller/user/userManagement.controller");

const router = express.Router();

// Admin Routes
router.get("/admin/users", isAuthenticated, isAdmin, getAllUsers);
router.get("/admin/users/stats", isAuthenticated, isAdmin, getUserStats);
router.get("/admin/users/:id", isAuthenticated, isAdmin, getUserById);
router.put("/admin/users/:id", isAuthenticated, isAdmin, updateUser);
router.delete("/admin/users/:id", isAuthenticated, isAdmin, deleteUser);
router.put("/admin/users/:id/change-password", isAuthenticated, isAdmin, changeUserPassword);
router.put("/admin/users/:id/deactivate", isAuthenticated, isAdmin, deactivateUser);
router.put("/admin/users/:id/activate", isAuthenticated, isAdmin, activateUser);

// User Routes
router.get("/profile", isAuthenticated, getOwnProfile);
router.put("/profile", isAuthenticated, updateOwnProfile);
router.put("/change-password", isAuthenticated, changeOwnPassword);

module.exports = router;

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../model/User.model");
require("dotenv").config();


// Middleware for Check is user authenticated or not ?
exports.isAuthenticated = asyncHandler(async (req, res, next) => {
    const token =  
        req.cookies?.token ||
        req.body?.token ||
        req.header("Authorization")?.replace("Bearer ", "");

    // If Not Token Then Unauthorised
    if (!token) {
        return res.error("Token Missing", 401);
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            return res.error("No User Found", 401);
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('Error From Auth MiddleWare.',error.message);
        return res.error("Something Went Wrong !", 401);
    }

    // check is token is valid Or Not ? If Not Then Error
});

// Middleware for check is user is admin Or someone else if admin then go to next controller
exports.isAdmin = asyncHandler(async (req, res, next) => {
    const user = req?.user ?? null;
    // console.log("User Data ->", user);
    // Step 1: Check if token attached user info
    if (!user) {
        return res.error("Unauthorized access. User not authenticated.", 401);
    }

    // Step 2: Check token claims admin access
    if (!user.isAdmin || user.role !== "admin") {
        return res.error("Access denied. Admins only.", 403);
    }

    // Step 3: Get latest user details from DB
    const userDetails = await User.findById(user._id);

    // Step 4: Handle user not found
    if (!userDetails) {
        return res.error("User not found", 404);
    }

    // Step 5: Double-check role and admin flag

    if (userDetails.role !== "admin" || !userDetails.isAdmin) {
        return res.error("User role can't be verified", 403);
    }

    // All good — move to next handler
    next();
});

// Middleware for check is user is Customer(user) Or someone else if Customer(user) then go to next controller
exports.isUser = asyncHandler(async (req, res, next) => {

    const user = req?.user ?? null;

    // Step 1: Check if token attached user info
    if (!user) {
        return res.error("Unauthorized access. User not authenticated.", 401);
    }

    // Step 2: Check token claims user access or not ?
    if (user.role !== "user") {
        return res.error("Access denied. User only.", 403);
    }
    // Step 3: Get latest user details from DB
    const userDetails = await User.findById(user._id);

    // Step 4: Handle user not found
    if (!userDetails) {
        return res.error("User not found", 404);
    }
    // Step 5: Double-check role and admin flag
    if (userDetails.role !== user.role) {
        return res.error("User role can't be verified", 403);
    }

    // All Good
    next();
});

// Role-based authorization middleware
exports.authorizeRoles = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        const user = req?.user ?? null;

        if (!user) {
            return res.error("Unauthorized access. User not authenticated.", 401);
        }

        if (!allowedRoles.includes(user.role)) {
            return res.error(`Access denied. Required roles: ${allowedRoles.join(", ")}`, 403);
        }

        // Get latest user details from DB
        const userDetails = await User.findById(user._id).select("-password -refreshToken");

        if (!userDetails) {
            return res.error("User not found", 404);
        }

        if (!allowedRoles.includes(userDetails.role)) {
            return res.error("User role can't be verified", 403);
        }

        req.user = userDetails;
        next();
    });
};

// Super Admin middleware
exports.isSuperAdmin = asyncHandler(async (req, res, next) => {
    const user = req?.user ?? null;

    if (!user) {
        return res.error("Unauthorized access. User not authenticated.", 401);
    }

    if (user.role !== "super_admin") {
        return res.error("Access denied. Super Admin only.", 403);
    }

    const userDetails = await User.findById(user._id).select("-password -refreshToken");

    if (!userDetails) {
        return res.error("User not found", 404);
    }

    if (userDetails.role !== "super_admin") {
        return res.error("User role can't be verified", 403);
    }

    req.user = userDetails;
    next();
});

// Mentor middleware
exports.isMentor = asyncHandler(async (req, res, next) => {
    const user = req?.user ?? null;

    if (!user) {
        return res.error("Unauthorized access. User not authenticated.", 401);
    }

    if (user.role !== "mentor") {
        return res.error("Access denied. Mentor only.", 403);
    }

    const userDetails = await User.findById(user._id).select("-password -refreshToken");

    if (!userDetails) {
        return res.error("User not found", 404);
    }

    if (userDetails.role !== "mentor") {
        return res.error("User role can't be verified", 403);
    }

    req.user = userDetails;
    next();
});

// Operations Manager middleware
exports.isOperationsManager = asyncHandler(async (req, res, next) => {
    const user = req?.user ?? null;

    if (!user) {
        return res.error("Unauthorized access. User not authenticated.", 401);
    }

    if (user.role !== "operations_manager") {
        return res.error("Access denied. Operations Manager only.", 403);
    }

    const userDetails = await User.findById(user._id).select("-password -refreshToken");

    if (!userDetails) {
        return res.error("User not found", 404);
    }

    if (userDetails.role !== "operations_manager") {
        return res.error("User role can't be verified", 403);
    }

    req.user = userDetails;
    next();
});

// Finance Manager middleware
exports.isFinanceManager = asyncHandler(async (req, res, next) => {
    const user = req?.user ?? null;

    if (!user) {
        return res.error("Unauthorized access. User not authenticated.", 401);
    }

    if (user.role !== "finance_manager") {
        return res.error("Access denied. Finance Manager only.", 403);
    }

    const userDetails = await User.findById(user._id).select("-password -refreshToken");

    if (!userDetails) {
        return res.error("User not found", 404);
    }

    if (userDetails.role !== "finance_manager") {
        return res.error("User role can't be verified", 403);
    }

    req.user = userDetails;
    next();
});

// Permission-based authorization middleware
exports.hasPermission = (permission) => {
    return asyncHandler(async (req, res, next) => {
        const user = req?.user ?? null;

        if (!user) {
            return res.error("Unauthorized access. User not authenticated.", 401);
        }

        // Super Admin has all permissions
        if (user.role === "super_admin") {
            return next();
        }

        // Check if user has the required permission
        if (!user.permissions || !user.permissions.includes(permission)) {
            return res.error(`Access denied. Required permission: ${permission}`, 403);
        }

        next();
    });
};

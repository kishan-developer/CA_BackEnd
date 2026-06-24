const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.middleware");

const addressRouter = require("./adress.routes");

// servise route 

const usermaprouter = require("./user.map.routes");
const notificationrouter = require("./user.notification.routes")
const userSupportrouter = require("./user.support.routes");
const userManagementRouter = require("./userManagement.routes");

const userRoutes = express.Router();

const User = require('../../model/User.model')

// Private Routes For User
// adminRouter.use(isAuthenticated);

// shelter 
// Route  - /api/v1/user/service


// Route  - /api/v1/user/blog
userRoutes.use("/blog", isAuthenticated, ) // public route

// Route  - /api/v1/user/map
userRoutes.use("/map", isAuthenticated, usermaprouter);

// Route - /api/v1/user/notification
userRoutes.use("/notification", isAuthenticated, notificationrouter)

// Route - /api/v1/user/notification
userRoutes.use("/support", isAuthenticated, userSupportrouter)


userRoutes.use("/address", isAuthenticated, addressRouter);
userRoutes.use("/", userManagementRouter);


userRoutes.put('/update-profile', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the JWT payload
        // Define a list of allowed fields to update to prevent malicious updates
        const allowedUpdates = ['firstName', 'lastName', 'dob', 'gender'];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Step 3: Check if any valid fields were actually provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
        }

        // Find the user by ID and update the allowed fields
        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Send back the updated user data (excluding sensitive information like password)
        const updatedUser = user.toObject();
        delete updatedUser.password;
        delete updatedUser.forgotPasswordToken;
        delete updatedUser.refreshToken;

        res.status(200).json({ success: true, message: 'Profile updated successfully.', user: updatedUser });

    } catch (error) {
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Server error occurred while updating profile.' });
    }
});

module.exports = userRoutes;

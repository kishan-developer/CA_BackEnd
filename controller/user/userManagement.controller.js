const asyncHandler = require("express-async-handler");
const User = require("../../model/User.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = {};
        if (req.query.role) filter.role = req.query.role;
        if (req.query.gender) filter.gender = req.query.gender;
        if (req.query.search) {
            filter.$or = [
                { firstName: { $regex: req.query.search, $options: 'i' } },
                { lastName: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password -forgotPasswordToken -refreshToken')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);

        return res.success("Users retrieved successfully", {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.error("Failed to fetch users", 500);
    }
});

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -forgotPasswordToken -refreshToken');

        if (!user) {
            return res.error("User not found", 404);
        }

        return res.success("User retrieved successfully", { user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.error("Failed to fetch user", 500);
    }
});

// @desc    Update user by ID (Admin)
// @route   PUT /api/v1/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, dob, gender, phone, role, isAdmin, avatar } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.error("User not found", 404);
        }

        // Update allowed fields
        if (firstName) user.firstName = firstName.toLowerCase();
        if (lastName) user.lastName = lastName.toLowerCase();
        if (dob) user.dob = dob;
        if (gender) user.gender = gender.toLowerCase();
        if (phone) user.phone = phone;
        if (role) user.role = role;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;
        if (avatar) user.avatar = avatar;

        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.password;
        delete updatedUser.forgotPasswordToken;
        delete updatedUser.refreshToken;

        return res.success("User updated successfully", { user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.error(messages.join(', '), 400);
        }
        return res.error("Failed to update user", 500);
    }
});

// @desc    Delete user by ID (Admin)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.error("User not found", 404);
        }

        await User.findByIdAndDelete(req.params.id);

        return res.success("User deleted successfully", { userId: req.params.id });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.error("Failed to delete user", 500);
    }
});

// @desc    Change user password (Admin)
// @route   PUT /api/v1/admin/users/:id/change-password
// @access  Private/Admin
exports.changeUserPassword = asyncHandler(async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.error("New password is required", 400);
        }

        if (newPassword.length < 6) {
            return res.error("Password must be at least 6 characters", 400);
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.error("User not found", 404);
        }

        user.password = newPassword;
        await user.save();

        return res.success("Password changed successfully");
    } catch (error) {
        console.error('Error changing password:', error);
        return res.error("Failed to change password", 500);
    }
});

// @desc    Update own profile (User)
// @route   PUT /api/v1/user/profile
// @access  Private
exports.updateOwnProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { firstName, lastName, dob, gender, phone, avatar } = req.body;

        const allowedUpdates = ['firstName', 'lastName', 'dob', 'gender', 'phone', 'avatar'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.error("No valid fields provided for update", 400);
        }

        // Convert to lowercase for string fields
        if (updates.firstName) updates.firstName = updates.firstName.toLowerCase();
        if (updates.lastName) updates.lastName = updates.lastName.toLowerCase();
        if (updates.gender) updates.gender = updates.gender.toLowerCase();

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        ).select('-password -forgotPasswordToken -refreshToken');

        if (!user) {
            return res.error("User not found", 404);
        }

        return res.success("Profile updated successfully", { user });
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.error(messages.join(', '), 400);
        }
        return res.error("Failed to update profile", 500);
    }
});

// @desc    Change own password (User)
// @route   PUT /api/v1/user/change-password
// @access  Private
exports.changeOwnPassword = asyncHandler(async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.error("All password fields are required", 400);
        }

        if (newPassword !== confirmPassword) {
            return res.error("New password and confirm password do not match", 400);
        }

        if (newPassword.length < 6) {
            return res.error("Password must be at least 6 characters", 400);
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.error("User not found", 404);
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.error("Current password is incorrect", 400);
        }

        user.password = newPassword;
        await user.save();

        return res.success("Password changed successfully");
    } catch (error) {
        console.error('Error changing password:', error);
        return res.error("Failed to change password", 500);
    }
});

// @desc    Get own profile
// @route   GET /api/v1/user/profile
// @access  Private
exports.getOwnProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .select('-password -forgotPasswordToken -refreshToken')
            .populate('shippingAddress')
            .populate('defaultAddress');

        if (!user) {
            return res.error("User not found", 404);
        }

        return res.success("Profile retrieved successfully", { user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.error("Failed to fetch profile", 500);
    }
});

// @desc    Deactivate user account (Admin)
// @route   PUT /api/v1/admin/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.error("User not found", 404);
        }

        // You could add an 'isActive' field to the user schema
        // For now, we'll set role to 'inactive' or use a flag
        user.isActive = false;
        await user.save();

        return res.success("User deactivated successfully", { userId: req.params.id });
    } catch (error) {
        console.error('Error deactivating user:', error);
        return res.error("Failed to deactivate user", 500);
    }
});

// @desc    Activate user account (Admin)
// @route   PUT /api/v1/admin/users/:id/activate
// @access  Private/Admin
exports.activateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.error("User not found", 404);
        }

        user.isActive = true;
        await user.save();

        return res.success("User activated successfully", { userId: req.params.id });
    } catch (error) {
        console.error('Error activating user:', error);
        return res.error("Failed to activate user", 500);
    }
});

// @desc    Get user statistics (Admin)
// @route   GET /api/v1/admin/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const regularUsers = await User.countDocuments({ role: 'user' });
        const googleUsers = await User.countDocuments({ authProvider: 'google' });
        const appleUsers = await User.countDocuments({ authProvider: 'apple' });
        const localUsers = await User.countDocuments({ authProvider: 'local' });

        const usersByMonth = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            }
        ]);

        return res.success("User statistics retrieved successfully", {
            totalUsers,
            activeUsers,
            adminUsers,
            regularUsers,
            googleUsers,
            appleUsers,
            localUsers,
            usersByMonth
        });
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        return res.error("Failed to fetch user statistics", 500);
    }
});

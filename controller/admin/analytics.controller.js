const Shelter = require("../../model/ShelterSchema.model");
const User = require("../../model/User.model");
const Booking = require("../../model/BookingSchema.model");


// ======================================================
//  GET TRAFFIC STATS
// ======================================================
const getTraffic = async (req, res) => {
  try {
    const traffic = await Traffic.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Traffic stats fetched successfully",
      data: traffic,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
//  POPULAR / TOP SHELTERS
// ======================================================
const getShelterStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      { $group: { _id: "$shelterId", totalBookings: { $sum: 1 } } },
      { $sort: { totalBookings: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "shelters",
          localField: "_id",
          foreignField: "_id",
          as: "shelter",
        },
      },
      { $unwind: "$shelter" },
    ]);

    res.status(200).json({
      success: true,
      message: "Shelter stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
//  USER ANALYTICS
// ======================================================
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          newUsers: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "User stats fetched successfully",
      data: { totalUsers, monthlyUsers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
//  REVENUE ANALYTICS
// ======================================================
const getRevenueStats = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$amount" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Revenue stats fetched successfully",
      data: revenue,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  getTraffic,
  getShelterStats,
  getUserStats,
  getRevenueStats,
};
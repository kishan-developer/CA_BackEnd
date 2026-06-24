const Shelter = require("../../model/ShelterSchema.model");
const User = require("../../model/User.model");
const Booking = require("../../model/BookingSchema.model");

// =========================
//  ADMIN DASHBOARD STATS
// =========================

const getAdminDashboardStats = async (req, res) => {
  try {
    //  Total shelters
    const totalShelters = await Shelter.countDocuments();

    //  Total users
    const totalUsers = await User.countDocuments();

    // Total revenue
    const totalRevenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    //  Active bookings
    const activeBookings = await Booking.countDocuments({ status: "active" });

    //  Monthly Revenue Graph (Last 6 months)
    const monthlyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    //  User Growth Graph (Last 6 months)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalShelters,
        totalUsers,
        totalRevenue,
        activeBookings,
        monthlyRevenue,
        userGrowth,
      },
    });
  } catch (error) {
    console.log("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboardStats,
};
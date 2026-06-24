const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: 'AdShelter' },
  amount: Number,
  razorpayOrderId: String,
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'] },
  expiryDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

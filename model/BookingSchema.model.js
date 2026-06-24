const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  amount: Number,
  razorpayOrderId: String,
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'] },
  expiryDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

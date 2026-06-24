const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  withFallPico: {
    type: Boolean,
    default: false,
  },
  withTassels: {
    type: Boolean,
    default: false,
  },
  isOfferAplied: {
    type: Boolean,
    default: false,
  },
  offer: {
    type: Number,
    default: 0,
  },
});

const shippingAddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    // Snapshot (important)
    shippingAddressSnapshot: shippingAddressSchema,

    totalAmount: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    paymentMethod: {
      type: String, // upi, card, wallet, cod
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,

    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
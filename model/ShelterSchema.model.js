// const mongoose = require("mongoose");

// const shelterSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   city: { type: String, required: true },
//   area: String,
//   size: String,
//   price: Number,
//   images: [String], // S3 URLs
//   location: {
//     lat: Number,
//     lng: Number
//   },
//   status: { 
//     type: String, 
//     enum: ['Available', 'Booked', 'Maintenance'], 
//     default: 'Available' 
//   },
//   currentOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });


// module.exports = mongoose.model("Shelter", shelterSchema);


const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    price: { type: Number, required: true },
    size: { type: String },

    city: { type: String, required: true },
    area: { type: String },

    status: {
      type: String,
      enum: ["Available", "Booked", "Maintenance"],
      default: "Available",
    },

    latitude: Number,
    longitude: Number,

    images: [String], // S3 URLs

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    maintenanceLogs: [
      {
        note: String,
        date: { type: Date, default: Date.now },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    bookingHistory: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        startDate: Date,
        endDate: Date,
        pricePaid: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shelter", shelterSchema);

const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String },
  businessType: { type: String },
  gstin: { type: String },
  pan: { type: String },
  annualTurnover: { type: String },
  service: { type: String, required: true },
  city: { type: String, required: true },
  urgency: { type: String },
  preferredContact: { type: String },
  message: { type: String, required: true },
  formType: { type: String, default: 'contact' },
}, { timestamps: true });

module.exports = mongoose.model("Contact", ContactSchema);
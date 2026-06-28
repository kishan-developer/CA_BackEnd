const mongoose = require("mongoose");

const ITRFilingSchema = new mongoose.Schema({
  // Personal Information
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  fatherName: { type: String, required: true },
  
  // Identity Details
  panNumber: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  residentialStatus: { type: String, required: true },
  
  // Address Information
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  
  // Plan Information
  planTitle: { type: String },
  planPrice: { type: String },
  
  formType: { type: String, default: 'itr_filing' },
}, { timestamps: true });

module.exports = mongoose.model("ITRFiling", ITRFilingSchema);

const mongoose = require("mongoose");

const GSTComplianceSchema = new mongoose.Schema({
  // Contact Information
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  businessName: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  preferredContactMethod: { type: String, required: true },
  
  // GST Registration Details
  gstinNumber: { type: String, required: true },
  legalBusinessName: { type: String, required: true },
  tradeName: { type: String, required: true },
  panNumber: { type: String, required: true },
  businessType: { type: String, required: true },
  gstRegistrationState: { type: String, required: true },
  principalPlaceOfBusiness: { type: String, required: true },
  natureOfBusiness: { type: String, required: true },
  
  // GST Compliance Services
  services: [{ type: String }],
  
  // Plan Information
  planTitle: { type: String },
  planPrice: { type: String },
  
  formType: { type: String, default: 'gst_compliance' },
}, { timestamps: true });

module.exports = mongoose.model("GSTCompliance", GSTComplianceSchema);

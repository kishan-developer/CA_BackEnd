require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./model/Service.model');

const sampleServices = [
  {
    title: "Company Registration",
    slug: "company-registration",
    category: "Registration",
    description: "Complete company registration services for private limited companies, LLPs, and more.",
    longDescription: "We provide end-to-end company registration services including Private Limited Company, One Person Company, Limited Liability Partnership, and more. Our experts handle all documentation and compliance requirements.",
    heroTitle: "Start Your Business Journey",
    image: "/services_images/company-registration.png",
    pricing: 8999,
    pricingTimeline: [
      { label: "Processing Time", value: "7-10 Days", description: "Standard registration timeline" },
      { label: "Government Fees", value: "Included", description: "All statutory fees included" }
    ],
    benefits: ["Legal Recognition", "Limited Liability Protection", "Easy Fundraising", "Tax Benefits"],
    benefitsRich: [
      { title: "Legal Entity Status", desc: "Your company becomes a separate legal entity with its own identity" },
      { title: "Limited Liability", desc: "Personal assets remain protected from business liabilities" },
      { title: "Credibility", desc: "Enhances trust with customers, investors, and partners" }
    ],
    targetAudience: ["Startups", "Entrepreneurs", "Small Business Owners"],
    audienceDesc: "Ideal for anyone looking to start a new business venture in India",
    included: ["DIN & DSC", "Name Approval", "Incorporation Certificate", "PAN & TAN"],
    process: [
      { t: "Document Collection", d: "Gather required documents from directors" },
      { t: "Name Approval", d: "Apply for unique company name" },
      { t: "Filing Incorporation", d: "Submit incorporation documents to MCA" },
      { t: "Certificate Issuance", d: "Receive Certificate of Incorporation" }
    ],
    documents: ["PAN Card", "Aadhaar Card", "Address Proof", "Passport Size Photos"],
    faqs: [
      { q: "What documents are required for company registration?", a: "PAN card, Aadhaar card, address proof, and passport size photos of all directors are required." },
      { q: "How long does company registration take?", a: "Typically 7-10 working days after document submission." }
    ],
    stats: [{ value: "5000+", label: "Companies Registered" }, { value: "99%", label: "Success Rate" }],
    featured: true,
    active: true,
    order: 1
  },
  {
    title: "GST Registration",
    slug: "gst-registration",
    category: "Taxation",
    description: "Professional GST registration services for businesses with turnover above threshold limits.",
    longDescription: "Get your GST registration done efficiently with our expert assistance. We handle the entire process from document verification to GSTIN issuance.",
    heroTitle: "Get GST Compliant",
    image: "/services_images/gst-registration.png",
    pricing: 1999,
    pricingTimeline: [
      { label: "Processing Time", value: "3-5 Days", description: "Quick GST registration" }
    ],
    benefits: ["Legal Compliance", "Input Tax Credit", "Interstate Trade", "Business Credibility"],
    benefitsRich: [
      { title: "Legal Compliance", desc: "Mandatory for businesses with turnover above threshold" },
      { title: "Input Tax Credit", desc: "Claim credit on taxes paid on purchases" },
      { title: "Nationwide Trade", desc: "Enable interstate and intrastate trade" }
    ],
    targetAudience: ["Traders", "Manufacturers", "Service Providers"],
    audienceDesc: "Required for businesses with annual turnover above ₹40 lakhs",
    included: ["GSTIN Registration", "GST Portal Setup", "Certificate Issuance"],
    process: [
      { t: "Document Preparation", d: "Prepare and verify required documents" },
      { t: "Application Filing", d: "Submit GST registration application" },
      { t: "Verification", d: "Complete verification process" },
      { t: "GSTIN Issuance", d: "Receive GST identification number" }
    ],
    documents: ["PAN Card", "Aadhaar Card", "Business Address Proof", "Bank Account Details", "Photographs"],
    faqs: [
      { q: "Who needs GST registration?", a: "Businesses with turnover above ₹40 lakhs (₹10 lakhs for special category states) need GST registration." },
      { q: "What documents are required?", a: "PAN card, Aadhaar card, business address proof, bank account details, and photographs of proprietors/partners/directors." }
    ],
    stats: [{ value: "10000+", label: "GST Registrations" }, { value: "100%", label: "Success Rate" }],
    featured: true,
    active: true,
    order: 2
  },
  {
    title: "Income Tax Filing",
    slug: "income-tax-filing",
    category: "Taxation",
    description: "Professional income tax filing services for individuals and businesses with expert guidance.",
    longDescription: "File your income tax returns with confidence. Our tax experts ensure accurate filing, maximize deductions, and maintain compliance with latest tax laws.",
    heroTitle: "File Your Taxes with Confidence",
    image: "/services_images/income-tax.png",
    pricing: 1499,
    pricingTimeline: [
      { label: "Processing Time", value: "1-2 Days", description: "Quick tax filing" }
    ],
    benefits: ["Compliance", "Maximize Refunds", "Avoid Penalties", "Expert Guidance"],
    benefitsRich: [
      { title: "Compliance Assurance", desc: "Ensure compliance with latest tax laws and regulations" },
      { title: "Maximum Refunds", desc: "Our experts help you maximize eligible deductions" },
      { title: "Penalty Avoidance", desc: "Avoid penalties by filing on time" }
    ],
    targetAudience: ["Salaried Individuals", "Business Owners", "Freelancers"],
    audienceDesc: "Essential for all taxpayers with taxable income",
    included: ["ITR Preparation", "Review & Filing", "Acknowledgment", "Tax Planning Advice"],
    process: [
      { t: "Document Collection", d: "Gather income and investment documents" },
      { t: "Tax Calculation", d: "Calculate taxable income and deductions" },
      { t: "ITR Preparation", d: "Prepare income tax return" },
      { t: "Filing & Acknowledgment", d: "File return and provide acknowledgment" }
    ],
    documents: ["Form 16", "Form 26AS", "Aadhaar Card", "PAN Card", "Bank Statements", "Investment Proofs"],
    faqs: [
      { q: "When should I file my income tax return?", a: "The due date for filing ITR is typically July 31st for individuals. Late filing may attract penalties." },
      { q: "What documents are required?", a: "Form 16, Form 26AS, Aadhaar card, PAN card, bank statements, and investment proofs are required." }
    ],
    stats: [{ value: "8000+", label: "ITRs Filed" }, { value: "98%", label: "Customer Satisfaction" }],
    featured: true,
    active: true,
    order: 3
  }
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/CA_Web');
    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert sample services
    const insertedServices = await Service.insertMany(sampleServices);
    console.log(`Inserted ${insertedServices.length} services`);

    console.log('Services seeded successfully!');
  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedServices();

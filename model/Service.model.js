const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['New Business', 'Registration', 'Taxation', 'Legal', 'Compliance', 'Advisory'],
        },
        subCategory: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        longDescription: {
            type: String,
        },
        heroTitle: {
            type: String,
        },
        image: {
            type: String,
            default: '/services_images/registrations.png'
        },
        pricing: {
            type: Number,
            default: 0,
        },
        pricingTimeline: [
            {
                label: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                }
            }
        ],
        benefits: [
            {
                type: String,
            }
        ],
        benefitsRich: [
            {
                title: {
                    type: String,
                    required: true,
                },
                desc: {
                    type: String,
                    required: true,
                }
            }
        ],
        targetAudience: [
            {
                type: String,
            }
        ],
        audienceDesc: {
            type: String,
        },
        included: [
            {
                type: String,
            }
        ],
        process: [
            {
                t: {
                    type: String,
                    required: true,
                },
                d: {
                    type: String,
                    required: true,
                }
            }
        ],
        documents: [
            {
                type: String,
            }
        ],
        faqs: [
            {
                q: {
                    type: String,
                    required: true,
                },
                a: {
                    type: String,
                    required: true,
                }
            }
        ],
        stats: [
            {
                value: {
                    type: String,
                },
                label: {
                    type: String,
                }
            }
        ],
        featured: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        metaTitle: {
            type: String,
        },
        metaDescription: {
            type: String,
        },
        metaKeywords: [
            {
                type: String,
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Index for faster queries
serviceSchema.index({ category: 1 });
serviceSchema.index({ active: 1 });
serviceSchema.index({ featured: 1 });

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;

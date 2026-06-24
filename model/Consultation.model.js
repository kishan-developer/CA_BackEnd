const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
    {
        // For authenticated users
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        // For public bookings
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        service: {
            type: String,
        },
        // For mentor-based bookings
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor",
        },
        mentorName: {
            type: String,
        },
        mentorExpertise: [
            {
                type: String,
            }
        ],
        mentorImage: {
            type: String,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            default: "30 minutes",
        },
        mode: {
            type: String,
            enum: ['zoom', 'in-person', 'phone'],
            default: 'zoom',
        },
        status: {
            type: String,
            enum: ['Pending', 'pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
            default: 'Pending',
        },
        price: {
            type: Number,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        paymentId: {
            type: String,
        },
        meetingLink: {
            type: String,
        },
        location: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        notes: {
            type: String,
        },
        message: {
            type: String,
        },
        userNotes: {
            type: String,
        },
        consultationType: {
            type: String,
            default: 'strategic',
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
        feedback: {
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            comments: {
                type: String,
            },
            submittedAt: {
                type: Date,
            }
        },
        rescheduleHistory: [
            {
                oldDate: String,
                oldTime: String,
                newDate: String,
                newTime: String,
                rescheduledAt: {
                    type: Date,
                    default: Date.now,
                },
                rescheduledBy: {
                    type: String,
                    enum: ['user', 'admin'],
                }
            }
        ],
        cancellationReason: {
            type: String,
        },
        cancelledBy: {
            type: String,
            enum: ['user', 'admin'],
        },
        cancelledAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
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
consultationSchema.index({ user: 1 });
consultationSchema.index({ mentor: 1 });
consultationSchema.index({ date: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ user: 1, status: 1 });
consultationSchema.index({ mentor: 1, date: 1 });
consultationSchema.index({ email: 1 });

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;

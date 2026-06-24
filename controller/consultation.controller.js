const asyncHandler = require("express-async-handler");
const Consultation = require("../model/Consultation.model");
const User = require("../model/User.model");
const mailSender = require("../utils/mailSender.utils");
require("dotenv").config();

// @desc    Create new consultation booking
// @route   POST /api/v1/consultation/book
// @access  Private
exports.bookConsultation = asyncHandler(async (req, res) => {
    try {
        const { mentor, mentorName, mentorExpertise, mentorImage, date, time, mode, notes, consultationType } = req.body;
        const userId = req.user._id;

        if (!mentor || !date || !time) {
            return res.error("Mentor, date, and time are required", 400);
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.error("User not found", 404);
        }

        // Check if slot is already booked
        const existingBooking = await Consultation.findOne({
            mentor,
            date,
            time,
            status: { $in: ['pending', 'confirmed', 'rescheduled'] }
        });

        if (existingBooking) {
            return res.error("This time slot is already booked", 400);
        }

        // Get mentor price from user's request or default
        const price = req.body.price || 499;

        const bookingData = {
            user: userId,
            mentor,
            mentorName,
            mentorExpertise,
            mentorImage,
            date,
            time,
            duration: "30 minutes",
            mode: mode || 'zoom',
            status: 'pending',
            price,
            paymentStatus: 'pending',
            notes,
            consultationType: consultationType || 'strategic',
            createdBy: userId,
        };

        const consultation = await Consultation.create(bookingData);

        // Send confirmation email
        try {
            const emailTemplate = `
                <h2>Consultation Booking Confirmed</h2>
                <p>Dear ${user.firstName},</p>
                <p>Your consultation has been booked successfully.</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Mentor:</strong> ${mentorName}</p>
                <p><strong>Mode:</strong> ${mode || 'Zoom'}</p>
                <p><strong>Price:</strong> ₹${price}</p>
                <p>Please complete the payment to confirm your booking.</p>
            `;
            
            await mailSender(user.email, "Consultation Booking Confirmed", emailTemplate);
        } catch (emailError) {
            console.error('Error sending booking email:', emailError);
        }

        return res.success("Consultation booked successfully. Please complete payment to confirm.", { consultation }, 201);
    } catch (error) {
        console.error('Error booking consultation:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.error(messages.join(', '), 400);
        }
        return res.error("Failed to book consultation", 500);
    }
});

// @desc    Get user's consultations
// @route   GET /api/v1/consultation/my-bookings
// @access  Private
exports.getMyConsultations = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = { user: userId };
        if (req.query.status) filter.status = req.query.status;

        const consultations = await Consultation.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Consultation.countDocuments(filter);

        return res.success("Consultations retrieved successfully", {
            consultations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        return res.error("Failed to fetch consultations", 500);
    }
});

// @desc    Get consultation by ID
// @route   GET /api/v1/consultation/:id
// @access  Private
exports.getConsultationById = asyncHandler(async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id)
            .populate('user', 'firstName lastName email phone')
            .populate('mentor');

        if (!consultation) {
            return res.error("Consultation not found", 404);
        }

        // Check if user is the owner or admin
        if (consultation.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.error("Not authorized to access this consultation", 403);
        }

        return res.success("Consultation retrieved successfully", { consultation });
    } catch (error) {
        console.error('Error fetching consultation:', error);
        return res.error("Failed to fetch consultation", 500);
    }
});

// @desc    Update consultation (reschedule)
// @route   PUT /api/v1/consultation/:id/reschedule
// @access  Private
exports.rescheduleConsultation = asyncHandler(async (req, res) => {
    try {
        const { newDate, newTime } = req.body;
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.error("Consultation not found", 404);
        }

        // Check if user is the owner
        if (consultation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.error("Not authorized to reschedule this consultation", 403);
        }

        // Check if new slot is available
        const existingBooking = await Consultation.findOne({
            mentor: consultation.mentor,
            date: newDate,
            time: newTime,
            status: { $in: ['pending', 'confirmed', 'rescheduled'] },
            _id: { $ne: req.params.id }
        });

        if (existingBooking) {
            return res.error("This time slot is already booked", 400);
        }

        // Add to reschedule history
        consultation.rescheduleHistory.push({
            oldDate: consultation.date,
            oldTime: consultation.time,
            newDate,
            newTime,
            rescheduledAt: new Date(),
            rescheduledBy: req.user.role === 'admin' ? 'admin' : 'user'
        });

        consultation.date = newDate;
        consultation.time = newTime;
        consultation.status = 'rescheduled';
        consultation.updatedBy = req.user._id;

        await consultation.save();

        return res.success("Consultation rescheduled successfully", { consultation });
    } catch (error) {
        console.error('Error rescheduling consultation:', error);
        return res.error("Failed to reschedule consultation", 500);
    }
});

// @desc    Cancel consultation
// @route   PUT /api/v1/consultation/:id/cancel
// @access  Private
exports.cancelConsultation = asyncHandler(async (req, res) => {
    try {
        const { reason } = req.body;
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.error("Consultation not found", 404);
        }

        // Check if user is the owner or admin
        if (consultation.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.error("Not authorized to cancel this consultation", 403);
        }

        consultation.status = 'cancelled';
        consultation.cancellationReason = reason;
        consultation.cancelledBy = req.user.role === 'admin' ? 'admin' : 'user';
        consultation.cancelledAt = new Date();
        consultation.updatedBy = req.user._id;

        await consultation.save();

        return res.success("Consultation cancelled successfully", { consultation });
    } catch (error) {
        console.error('Error cancelling consultation:', error);
        return res.error("Failed to cancel consultation", 500);
    }
});

// @desc    Update payment status
// @route   PUT /api/v1/consultation/:id/payment
// @access  Private
exports.updatePaymentStatus = asyncHandler(async (req, res) => {
    try {
        const { paymentStatus, paymentId } = req.body;
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.error("Consultation not found", 404);
        }

        consultation.paymentStatus = paymentStatus;
        if (paymentId) consultation.paymentId = paymentId;

        if (paymentStatus === 'paid') {
            consultation.status = 'confirmed';
        }

        consultation.updatedBy = req.user._id;
        await consultation.save();

        return res.success("Payment status updated successfully", { consultation });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return res.error("Failed to update payment status", 500);
    }
});

// @desc    Submit feedback
// @route   POST /api/v1/consultation/:id/feedback
// @access  Private
exports.submitFeedback = asyncHandler(async (req, res) => {
    try {
        const { rating, comments } = req.body;
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.error("Consultation not found", 404);
        }

        // Check if user is the owner
        if (consultation.user.toString() !== req.user._id.toString()) {
            return res.error("Not authorized to submit feedback for this consultation", 403);
        }

        consultation.feedback = {
            rating,
            comments,
            submittedAt: new Date()
        };

        consultation.updatedBy = req.user._id;
        await consultation.save();

        return res.success("Feedback submitted successfully", { consultation });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.error("Failed to submit feedback", 500);
    }
});

// @desc    Get all consultations (Admin)
// @route   GET /api/v1/admin/consultations
// @access  Private/Admin
exports.getAllConsultationsAdmin = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.mentor) filter.mentor = req.query.mentor;
        if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
        if (req.query.date) filter.date = req.query.date;

        const consultations = await Consultation.find(filter)
            .populate('user', 'firstName lastName email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Consultation.countDocuments(filter);

        return res.success("Consultations retrieved successfully", {
            consultations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        return res.error("Failed to fetch consultations", 500);
    }
});

// @desc    Update consultation (Admin)
// @route   PUT /api/v1/admin/consultations/:id
// @access  Private/Admin
exports.updateConsultationAdmin = asyncHandler(async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);

        if (!consultation) {
            return res.error("Consultation not found", 404);
        }

        const allowedUpdates = [
            'status', 'meetingLink', 'location', 'phoneNumber', 'notes', 'reminderSent'
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.status === 'completed') {
            consultation.completedAt = new Date();
        }

        Object.assign(consultation, updates);
        consultation.updatedBy = req.user._id;
        await consultation.save();

        return res.success("Consultation updated successfully", { consultation });
    } catch (error) {
        console.error('Error updating consultation:', error);
        return res.error("Failed to update consultation", 500);
    }
});

// @desc    Get consultation statistics (Admin)
// @route   GET /api/v1/admin/consultations/stats
// @access  Private/Admin
exports.getConsultationStats = asyncHandler(async (req, res) => {
    try {
        const totalConsultations = await Consultation.countDocuments();
        const pendingConsultations = await Consultation.countDocuments({ status: 'pending' });
        const confirmedConsultations = await Consultation.countDocuments({ status: 'confirmed' });
        const completedConsultations = await Consultation.countDocuments({ status: 'completed' });
        const cancelledConsultations = await Consultation.countDocuments({ status: 'cancelled' });

        const paidConsultations = await Consultation.countDocuments({ paymentStatus: 'paid' });
        const totalRevenue = await Consultation.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const consultationsByMonth = await Consultation.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$price', 0] } }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            }
        ]);

        return res.success("Consultation statistics retrieved successfully", {
            totalConsultations,
            pendingConsultations,
            confirmedConsultations,
            completedConsultations,
            cancelledConsultations,
            paidConsultations,
            totalRevenue: totalRevenue[0]?.total || 0,
            consultationsByMonth
        });
    } catch (error) {
        console.error('Error fetching consultation statistics:', error);
        return res.error("Failed to fetch consultation statistics", 500);
    }
});

// @desc    Get mentor's booked slots
// @route   GET /api/v1/consultation/mentor/:mentorId/slots
// @access  Public
exports.getMentorBookedSlots = asyncHandler(async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { date } = req.query;

        const filter = { mentor: mentorId, status: { $in: ['pending', 'confirmed', 'rescheduled'] } };
        if (date) filter.date = date;

        const bookings = await Consultation.find(filter)
            .select('date time status')
            .sort({ date: 1, time: 1 });

        const bookedSlots = bookings.map(booking => ({
            date: booking.date,
            time: booking.time,
            status: booking.status
        }));

        return res.success("Booked slots retrieved successfully", { bookedSlots });
    } catch (error) {
        console.error('Error fetching booked slots:', error);
        return res.error("Failed to fetch booked slots", 500);
    }
});

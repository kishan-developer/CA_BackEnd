const asyncHandler = require("express-async-handler");
const Service = require("../model/Service.model");
require("dotenv").config();

// @desc    Get all services (Public)
// @route   GET /api/v1/services
// @access  Public
exports.getAllServices = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = { active: true };
        if (req.query.category) filter.category = req.query.category;
        if (req.query.subCategory) filter.subCategory = req.query.subCategory;
        if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const services = await Service.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Service.countDocuments(filter);

        return res.success("Services retrieved successfully", {
            services,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.error("Failed to fetch services", 500);
    }
});

// @desc    Get service by slug (Public)
// @route   GET /api/v1/services/:slug
// @access  Public
exports.getServiceBySlug = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug, active: true });

        if (!service) {
            return res.error("Service not found", 404);
        }

        return res.success("Service retrieved successfully", { service });
    } catch (error) {
        console.error('Error fetching service:', error);
        return res.error("Failed to fetch service", 500);
    }
});

// @desc    Get services by category (Public)
// @route   GET /api/v1/services/category/:category
// @access  Public
exports.getServicesByCategory = asyncHandler(async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const services = await Service.find({ category, active: true })
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Service.countDocuments({ category, active: true });

        return res.success("Services retrieved successfully", {
            services,
            category,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching services by category:', error);
        return res.error("Failed to fetch services", 500);
    }
});

// @desc    Get all services (Admin - includes inactive)
// @route   GET /api/v1/admin/services
// @access  Private/Admin
exports.getAllServicesAdmin = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.active !== undefined) filter.active = req.query.active === 'true';
        if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { category: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const services = await Service.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Service.countDocuments(filter);

        return res.success("Services retrieved successfully", {
            services,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.error("Failed to fetch services", 500);
    }
});

// @desc    Get service by ID (Admin)
// @route   GET /api/v1/admin/services/:id
// @access  Private/Admin
exports.getServiceById = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.error("Service not found", 404);
        }

        return res.success("Service retrieved successfully", { service });
    } catch (error) {
        console.error('Error fetching service:', error);
        return res.error("Failed to fetch service", 500);
    }
});

// @desc    Create new service (Admin)
// @route   POST /api/v1/admin/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res) => {
    try {
        const {
            title,
            slug,
            category,
            subCategory,
            description,
            longDescription,
            heroTitle,
            image,
            pricing,
            pricingTimeline,
            benefits,
            benefitsRich,
            targetAudience,
            audienceDesc,
            included,
            process,
            documents,
            faqs,
            stats,
            featured,
            active,
            order,
            metaTitle,
            metaDescription,
            metaKeywords
        } = req.body;

        if (!title || !slug || !category || !description) {
            return res.error("Title, slug, category, and description are required", 400);
        }

        // Check if slug already exists
        const existingService = await Service.findOne({ slug });
        if (existingService) {
            return res.error("Service with this slug already exists", 400);
        }

        const serviceData = {
            title,
            slug: slug.toLowerCase(),
            category,
            subCategory,
            description,
            longDescription,
            heroTitle,
            image,
            pricing,
            pricingTimeline,
            benefits,
            benefitsRich,
            targetAudience,
            audienceDesc,
            included,
            process,
            documents,
            faqs,
            stats,
            featured: featured || false,
            active: active !== undefined ? active : true,
            order: order || 0,
            metaTitle,
            metaDescription,
            metaKeywords,
            createdBy: req.user._id,
        };

        const service = await Service.create(serviceData);

        return res.success("Service created successfully", { service }, 201);
    } catch (error) {
        console.error('Error creating service:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.error(messages.join(', '), 400);
        }
        return res.error("Failed to create service", 500);
    }
});

// @desc    Update service (Admin)
// @route   PUT /api/v1/admin/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.error("Service not found", 404);
        }

        // Check if slug is being changed and if it already exists
        if (req.body.slug && req.body.slug !== service.slug) {
            const existingService = await Service.findOne({ slug: req.body.slug });
            if (existingService) {
                return res.error("Service with this slug already exists", 400);
            }
        }

        const allowedUpdates = [
            'title', 'slug', 'category', 'subCategory', 'description', 'longDescription',
            'heroTitle', 'image', 'pricing', 'pricingTimeline', 'benefits', 'benefitsRich',
            'targetAudience', 'audienceDesc', 'included', 'process', 'documents', 'faqs',
            'stats', 'featured', 'active', 'order', 'metaTitle', 'metaDescription', 'metaKeywords'
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.slug) {
            updates.slug = updates.slug.toLowerCase();
        }

        updates.updatedBy = req.user._id;

        const updatedService = await Service.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        return res.success("Service updated successfully", { service: updatedService });
    } catch (error) {
        console.error('Error updating service:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.error(messages.join(', '), 400);
        }
        return res.error("Failed to update service", 500);
    }
});

// @desc    Delete service (Admin)
// @route   DELETE /api/v1/admin/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.error("Service not found", 404);
        }

        await Service.findByIdAndDelete(req.params.id);

        return res.success("Service deleted successfully", { serviceId: req.params.id });
    } catch (error) {
        console.error('Error deleting service:', error);
        return res.error("Failed to delete service", 500);
    }
});

// @desc    Toggle service active status (Admin)
// @route   PATCH /api/v1/admin/services/:id/toggle-active
// @access  Private/Admin
exports.toggleServiceActive = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.error("Service not found", 404);
        }

        service.active = !service.active;
        service.updatedBy = req.user._id;
        await service.save();

        return res.success(`Service ${service.active ? 'activated' : 'deactivated'} successfully`, { service });
    } catch (error) {
        console.error('Error toggling service active status:', error);
        return res.error("Failed to toggle service status", 500);
    }
});

// @desc    Toggle service featured status (Admin)
// @route   PATCH /api/v1/admin/services/:id/toggle-featured
// @access  Private/Admin
exports.toggleServiceFeatured = asyncHandler(async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.error("Service not found", 404);
        }

        service.featured = !service.featured;
        service.updatedBy = req.user._id;
        await service.save();

        return res.success(`Service ${service.featured ? 'added to' : 'removed from'} featured`, { service });
    } catch (error) {
        console.error('Error toggling service featured status:', error);
        return res.error("Failed to toggle featured status", 500);
    }
});

// @desc    Get service statistics (Admin)
// @route   GET /api/v1/admin/services/stats
// @access  Private/Admin
exports.getServiceStats = asyncHandler(async (req, res) => {
    try {
        const totalServices = await Service.countDocuments();
        const activeServices = await Service.countDocuments({ active: true });
        const featuredServices = await Service.countDocuments({ featured: true });
        const inactiveServices = await Service.countDocuments({ active: false });

        const servicesByCategory = await Service.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        return res.success("Service statistics retrieved successfully", {
            totalServices,
            activeServices,
            featuredServices,
            inactiveServices,
            servicesByCategory
        });
    } catch (error) {
        console.error('Error fetching service statistics:', error);
        return res.error("Failed to fetch service statistics", 500);
    }
});

// @desc    Get all categories (Public)
// @route   GET /api/v1/services/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Service.distinct('category', { active: true });

        return res.success("Categories retrieved successfully", { categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.error("Failed to fetch categories", 500);
    }
});

// @desc    Get featured services (Public)
// @route   GET /api/v1/services/featured
// @access  Public
exports.getFeaturedServices = asyncHandler(async (req, res) => {
    try {
        const services = await Service.find({ featured: true, active: true })
            .sort({ order: 1, createdAt: -1 })
            .limit(10);

        return res.success("Featured services retrieved successfully", { services });
    } catch (error) {
        console.error('Error fetching featured services:', error);
        return res.error("Failed to fetch featured services", 500);
    }
});

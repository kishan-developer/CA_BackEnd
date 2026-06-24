const express = require("express");
const adminRouter = express.Router();

const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");

const userRouter = require("./user.routes");
const { getOverview } = require("../../controller/admin/overview.controller");

const { getAdminDashboardStats } = require("../../controller/admin/admin.controller.js");

const adminOfferRouter = require("./offer.routes");

const bannerrouter = require("./banner.routes.js")
const adminblogRouter = require("./admin.blog.routes");
const contactRouter = require("./contact.routes")
const adminNewsletterrouter = require("./newsletter.routes.js");
const analyticsrouter = require("./analytics.routes.js")
const maprouter = require("./map.routes.js");
const cmsRouter = require("./cms.routes.js");

// Private Routes For Admin
adminRouter.use(isAuthenticated, isAdmin);

// website banner manage
// route - /api/v1/admin/banner
adminRouter.use("/banner", bannerrouter);

// route - /api/v1/admin/analytics
adminRouter.use("/analytics", analyticsrouter);

// route - /api/v1/admin/newsletter
adminRouter.use("/newsletter", adminNewsletterrouter);

// route - /api/v1/admin/contact
adminRouter.use("/contact", contactRouter)

// route - /api/v1/admin/map
adminRouter.use("/map", maprouter);

// Admin Dashboard Route
// route - /api/v1/admin/adminOverview
adminRouter.get("/adminOverview", getAdminDashboardStats )

adminRouter.get("/overview", getOverview);

adminRouter.use("/user", userRouter);
adminRouter.use("/cms", cmsRouter);

adminRouter.use("/offer", adminOfferRouter);

adminRouter.get('/newsletters',async(req,res)=>{
    try {
        const emails = await NewsletterModel.find({});
        return res.status(200).json(emails)
    } catch (error) {
       return  res.status(500).json({
            message:"Error wile fetching  emails"
        })
    }
})

module.exports = adminRouter;

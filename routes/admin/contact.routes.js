const {
    getAllMessages
} = require("../../controller/admin/contact.controller");

const contactRouter = require("express").Router();

contactRouter.get("/", getAllMessages);

module.exports = contactRouter;

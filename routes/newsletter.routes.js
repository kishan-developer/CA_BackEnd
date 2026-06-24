const express = require("express");
const usernewsletterrouter = express.Router();
const {
  subscribe,
  
} = require("../controller/public/newsletter.controller");

// USER ROUTE
usernewsletterrouter.post("/subscribe", subscribe);



module.exports = usernewsletterrouter;
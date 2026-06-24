const express = require("express");
const usermaprouter = express.Router();

const {
  updateShelterLocation,
  addShelterFromMap,
  getAllSheltersForMap,
} = require("../../controller/admin/map.controller");

// ADMIN
usermaprouter.put("/shelter/location/:shelterId", updateShelterLocation);
usermaprouter.post("/shelter/add-from-map", addShelterFromMap);

// USER
usermaprouter.get("/shelters/map", getAllSheltersForMap);

module.exports = usermaprouter;
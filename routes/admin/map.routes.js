const express = require("express");
const maprouter = express.Router();

const {
  updateShelterLocation,
  addShelterFromMap,
  getAllSheltersForMap,
} = require("../../controller/admin/map.controller");

// ADMIN
maprouter.put("/shelter/location/:shelterId", updateShelterLocation);
maprouter.post("/shelter/add-from-map", addShelterFromMap);

// USER
maprouter.get("/shelters/map", getAllSheltersForMap);

module.exports = maprouter;
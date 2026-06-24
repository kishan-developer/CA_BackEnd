const Shelter = require("../../model/ShelterSchema.model");

// =========================
// 📌 ADMIN: Update Shelter Location (Drag Marker)
// =========================
const updateShelterLocation = async (req, res) => {
  try {
    const { shelterId } = req.params;
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude are required",
      });
    }

    const updatedShelter = await Shelter.findByIdAndUpdate(
      shelterId,
      { location: { lat, lng } },
      { new: true }
    );

    if (!updatedShelter) {
      return res.status(404).json({
        success: false,
        message: "Shelter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shelter location updated",
      data: updatedShelter,
    });
  } catch (error) {
    console.log("Update Location Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update shelter location",
      error: error.message,
    });
  }
};

// =========================
// 📌 ADMIN: Add Shelter From Map
// =========================
const addShelterFromMap = async (req, res) => {
  try {
    const { name, city, area, price, lat, lng } = req.body;

    if (!name || !city || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Name, City, Latitude & Longitude required",
      });
    }

    const shelter = await Shelter.create({
      name,
      city,
      area,
      price,
      location: { lat, lng },
    });

    res.status(201).json({
      success: true,
      message: "Shelter added successfully from map",
      data: shelter,
    });
  } catch (error) {
    console.log("Add Shelter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add shelter",
      error: error.message,
    });
  }
};

// =========================
// 👥 USER: Show All Shelters on Map
// =========================
const getAllSheltersForMap = async (req, res) => {
  try {
    const shelters = await Shelter.find({}, "name location city area price");

    res.status(200).json({
      success: true,
      message: "Shelters fetched successfully",
      data: shelters,
    });
  } catch (error) {
    console.log("Map Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch shelters",
      error: error.message,
    });
  }
};

module.exports = {
  updateShelterLocation,
  addShelterFromMap,
  getAllSheltersForMap,
};
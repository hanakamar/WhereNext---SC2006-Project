const SavedLocationsModel = require('../models/SavedLocationsModel'); // Renamed the imported model to SavedLocationsModel
const mongoose = require('mongoose');

// Get all saved locations
const getSavedLocations = async (req, res) => {
    try {
        const location = await SavedLocationsModel.find({}).sort({ createdAt: -1 }); // Renamed variable to location
        res.status(200).json(location);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get a Saved Location by id
const getSavedLocationsById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Place not found' });
    } else {

        const location = await SavedLocationsModel.findById(id); // Renamed variable to Location
        if (!location) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(location);
    }
}

const getLocationsByUser = async (req, res) => {
    const { user } = req.query;

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    try {
        const locations = await SavedLocationsModel.find({ user }).sort({ createdAt: -1 });
        res.status(200).json(locations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new Saved Location
const saveLocation = async (req, res) => {
    const { email, locationName, description, date, time } = req.body;
    try {
        const newLocation = await SavedLocationsModel.create({ email, locationName, description, date, time }); // Renamed variable to newLocation
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a Saved Location
const deleteLocation = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Location not found' });
    } else {
        const deletedLocation = await SavedLocationsModel.findByIdAndDelete(id); // Renamed variable to deletedLocation

        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json({ deletedLocation });
    }
}

// Update a Saved Location
const updateSavedLocation = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Location not found' });
    } else {
        const { date, time } = req.body;

        const updatedSavedLocation = await SavedLocationsModel.findByIdAndUpdate(id, { date, time }, { new: true }); // Renamed variable to updatedSavedLocation
        if (!updatedSavedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.json(updatedSavedLocation);
    }
}

module.exports = {
    getSavedLocations,
    getSavedLocationsById,
    getLocationsByUser,
    saveLocation,
    deleteLocation,
    updateSavedLocation
}

const SavedPlace = require("../models/SavedPlaces");

exports.savePlace = async (req, res) => {
    try {
      const { email, place } = req.body;

      if (!email || !place) {
        return res.status(400).json({ error: "Missing email or place data" });
      }

      let user = await SavedPlace.findOne({ email });
      if (!user) {
        user = new SavedPlace({ email, savedPlaces: [place] });
      } else {
        const alreadyExists = user.savedPlaces.some(p => p.id === place.id);
        if (!alreadyExists) {
          user.savedPlaces.push(place);
        }
      }

      await user.save();
      res.status(200).json({ message: "Place saved!" });
    } catch (err) {
      console.error("Error saving place:", err);
      res.status(500).json({ error: "Server error" });
    }
};

exports.getSavedPlaces = async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await SavedPlace.findOne({ email });
      if (!user) {
        return res.status(200).json({ savedPlaces: [] });
      }

      res.status(200).json({ savedPlaces: user.savedPlaces });
    } catch (err) {
      console.error("Error fetching saved places:", err);
      res.status(500).json({ error: "Server error" });
    }
};

exports.deletePlace = async (req, res) => {
    try {
      const { email, placeId } = req.body;

      if (!email || !placeId) {
        return res.status(400).json({ error: "Missing email or place ID" });
      }

      const user = await SavedPlace.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.savedPlaces = user.savedPlaces.filter(p => p.id !== placeId);
      await user.save();

      res.status(200).json({ message: "Place deleted successfully" });
    } catch (err) {
      console.error("Error deleting place:", err);
      res.status(500).json({ error: "Server error" });
    }
};

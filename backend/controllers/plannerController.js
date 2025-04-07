const googlePlacesService = require('../service/GooglePlacesService');
const eventbriteService = require('../service/EventBriteService');

exports.getPlanData = async (req, res) => {
  try {
    const { latitude, longitude, bounds } = req.query;

    console.log("📍 Coordinates received:", latitude, longitude);
    if (bounds) {
      console.log("🧭 Bounds received:", JSON.parse(bounds));
    }

    const foodPlaces = await googlePlacesService.getNearbyFood(latitude, longitude);

    res.json({
      foodPlaces,
      events: [],
    });
  } catch (error) {
    console.error("❌ Planner API error:", error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// exports.getPlanData = (req, res) => {
//   console.log("📍 plannerController triggered");
//   res.json({ message: "It works!" });
// };


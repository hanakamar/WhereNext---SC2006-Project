const googlePlacesService = require('../service/GooglePlacesService');
const eventbriteService = require('../service/EventBriteService');

exports.getPlanData = async (req, res) => {
  try {
    console.log("🔍 Request received for planner data");

    const { latitude, longitude } = req.query;

    console.log("📍 Coordinates received:", latitude, longitude);
    console.log("🔍 googlePlacesService =", googlePlacesService);
    const foodPlaces = await googlePlacesService.getNearbyFood(latitude, longitude);
    console.log("🔍 googlePlacesService =", googlePlacesService);
    console.log("✅ Fetched food places");

    // const events = await eventbriteService.getNearbyEvents(latitude, longitude);
    // console.log("✅ Fetched events");
    
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


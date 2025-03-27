const axios = require('axios');

const getNearbyFood = async (lat, lng) => {
    const key = process.env.GOOGLE_PLACES_API_KEY;
  
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,  // ✅ Use template string here
          radius: 2000,
          type: 'restaurant',
          key,
        },
      }
    );
  
    console.log("📡 Google request:", {
      location: `${lat},${lng}`, // ✅ Correct template string
      radius: 2000,
      type: 'restaurant',
      key,
    });
  
    return response.data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: place.vicinity,
    }));
  };
  

module.exports = {
  getNearbyFood
};


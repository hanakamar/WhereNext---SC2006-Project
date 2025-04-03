const axios = require('axios');

const getNearbyFood = async (lat, lng) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const radius = 1000; // 1 km radius
  const types = ['restaurant', 'cafe'];
  let allResults = [];

  for (const type of types) {
    let nextPageToken = null;
    let pagesFetched = 0;

    do {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          key,
          location: `${lat},${lng}`,
          radius,
          type,
          pagetoken: nextPageToken,
        },
      });

      const { results, next_page_token } = response.data;
      allResults.push(...results);
      nextPageToken = next_page_token;
      pagesFetched++;

      if (nextPageToken) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before fetching next page
      }
    } while (nextPageToken && pagesFetched < 3);
  }

  // Deduplicate by place_id
  const unique = new Map();
  allResults.forEach(place => {
    unique.set(place.place_id, place);
  });

  return Array.from(unique.values()).map(place => ({
    id: place.place_id,
    name: place.name,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    address: place.vicinity,
    photoUrl: place.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${key}`
      : null,
    type: place.types?.includes('cafe') ? 'cafe' : 'restaurant',
    rating: place.rating || null,
    totalRatings: place.user_ratings_total || 0,
  }));
};

module.exports = {
  getNearbyFood,
};

const axios = require('axios');

const getNearbyEvents = async (lat, lng) => {
  const token = process.env.EVENTBRITE_TOKEN;

  const response = await axios.get(
    `https://www.eventbriteapi.com/v3/events/search/`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        'location.latitude': lat,
        'location.longitude': lng,
        'location.within': '10km',
        'expand': 'venue'
      }
    }
  );

  return response.data.events.map(event => ({
    id: event.id,
    name: event.name.text,
    lat: event.venue?.latitude,
    lng: event.venue?.longitude,
    description: event.description?.text
  })).filter(e => e.lat && e.lng);
};

// ✅ Correct way to export the function
module.exports = {
  getNearbyEvents
};

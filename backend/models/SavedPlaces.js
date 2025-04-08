const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    image: String,
    photoUrl:String,
    description: String,
    rating: Number,
    totalRatings :Number,
    lat: Number,
    lng: Number,
    type: String, // e.g. "restaurant" or "cafe"
  });

  const SavedPlacesSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    places: [PlaceSchema],
  });
  
  module.exports = mongoose.model("SavedPlaces", SavedPlacesSchema);

const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    id: String,
    name: String,
    address: String,
    photoUrl:String,
    rating: Number,
    totalRatings :Number,
    lat: Number,
    lng: Number,
    type: String, // e.g. "restaurant" or "cafe"
  });

  const SavedPlacesSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    savedPlaces: [PlaceSchema],
  });
  
  module.exports = mongoose.model("SavedPlaces", SavedPlacesSchema);

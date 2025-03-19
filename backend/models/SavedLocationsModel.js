const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SavedLocationsSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    time: { // Time in 24-hour format ("HH:MM")
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // Validates 00:00 to 23:59
            },
            message: "Invalid time format. Use HH:MM (24-hour format)."
        }
    }

}, { timestamps: true })

module.exports = mongoose.model('SavedLocations', SavedLocationsSchema)
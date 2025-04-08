const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BookmarkSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    id: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Bookmark', BookmarkSchema)
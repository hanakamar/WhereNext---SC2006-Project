const mongoose = require('mongoose');
const BookmarksModel = require('../models/BookmarksModel');



const getBookmarksByUser = async (req, res) => {
    const { email } = req.query;
    console.log("Email from query:", email); // Log the email from the query
    if (!email) {
        return res.status(400).json({ message: 'User not found' });
    }

    try {
        const bookmarks = await BookmarksModel.find({ email }).sort({ createdAt: -1 });
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new Saved Location
const saveBookmark = async (req, res) => {
    const { id, description, coordinates, name, address, image } = req.body;
    const { email } = req.query;
    try {
        const newBookmark = await BookmarksModel.create({ email, id, description, coordinates, name, address, image }); // Renamed variable to newBookmark
        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a Saved Bookmark
const deleteBookmark = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Bookmark not found' });
    } else {
        const deletedBookmark = await BookmarksModel.findByIdAndDelete(id); // Renamed variable to deletedBookmark

        if (!deletedBookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json({ deletedBookmark });
    }
}

module.exports = {
    getBookmarksByUser,
    saveBookmark,
    deleteBookmark,
}
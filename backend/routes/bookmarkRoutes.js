const express = require('express');
const { getBookmarksByUser, saveBookmark, deleteBookmark } = require('../controllers/bookmarkController');
const router = express.Router();


router.get('/', getBookmarksByUser); // Get all bookmarks
router.post('/', saveBookmark); // Add a new bookmark
router.delete('/:id', deleteBookmark); // Delete a bookmark by ID

module.exports = router;
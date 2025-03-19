const express = require('express');
const { createFeed, getFeeds, getFeedById, deleteFeed, updateFeed } = require('../controllers/feedController');


const router = express.Router();

router.get('/', getFeeds);

router.get('/:id', getFeedById);

router.post('/', createFeed);

router.delete('/:id', deleteFeed);

router.patch('/:id', updateFeed)

module.exports = router;
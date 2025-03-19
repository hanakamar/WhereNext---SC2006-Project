const Feed = require('../models/FeedModel');
const mongoose = require('mongoose');

// Get all feeds

const getFeeds = async (req, res) => {
    try {
        const feeds = await Feed.find({}).sort({ createdAt: -1 });
        res.status(200).json(feeds);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}

// Get a feed by id

const getFeedById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Feed not found' });
    }

    const feed = await Feed.findById(id);
    if (!feed) {
        return res.status(404).json({ message: 'Feed not found' });
    }
    res.status(200).json(feed);
}

// Create a new feed
const createFeed = async (req, res) => {
    const { title, content, img} = req.body;
    try {
        const feed = await Feed.create({ img, title, content });
        res.status(201).json(feed);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a feed

const deleteFeed = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Feed not found' });
    }
    const feed = await Feed.findByIdAndDelete(id);

    if (!feed) {
        return res.status(404).json({ message: 'Feed not found' });
    }
    res.json({ feed });
}

// Update a feed
const updateFeed = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Feed not found' });
    }
    const { title, content, likes } = req.body;

    const feed = await Feed.findByIdAndUpdate(id, { title, content, likes }, { new: true });
    if (!feed) {
        return res.status(404).json({ message: 'Feed not found' });
    }
    res.json(feed);
}


module.exports = {
    createFeed, getFeeds, getFeedById, deleteFeed, updateFeed
}
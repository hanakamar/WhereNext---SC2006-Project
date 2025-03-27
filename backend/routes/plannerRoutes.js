const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');

console.log("📌 plannerRoutes loaded"); // Add this log to confirm load
router.get('/', plannerController.getPlanData);

module.exports = router;

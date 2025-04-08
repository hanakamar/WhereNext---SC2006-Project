const express = require("express");
const router = express.Router();
const savedPlacesController = require("../controllers/savedPlacesController");

router.post("/", savedPlacesController.savePlace);
router.get("/", savedPlacesController.getSavedPlaces);


module.exports = router;

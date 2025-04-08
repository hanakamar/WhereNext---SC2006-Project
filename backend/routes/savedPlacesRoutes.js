const express = require("express");
const router = express.Router();
const savedPlacesController = require("../controllers/savedPlacesController");

router.post("/save", savedPlacesController.savePlace);
router.get("/saved", savedPlacesController.getSavedPlaces);


module.exports = router;

const express = require('express')
const { getSavedLocations,
    getSavedLocationsById,
    getLocationsByUser,
    saveLocation,
    deleteLocation,
    updateSavedLocation } = require('../controllers/savedLocationsController');


const router = express.Router()

router.get('/', getSavedLocations);
router.get('/search', getLocationsByUser);
router.get('/:id', getSavedLocationsById);



router.post('/', saveLocation);

router.delete('/:id', deleteLocation);

router.patch('/:id', updateSavedLocation)

module.exports = router;
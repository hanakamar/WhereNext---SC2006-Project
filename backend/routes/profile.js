const express = require('express')
// const { createProfile, getProfiles, getProfileById, deleteProfile, updateProfile, getAllProfiles } = require('../controllers/ProfileController');

// Controller Functions
const { signupUser, loginUser, updatePassword, getProfileById, updateName } = require('../controllers/profileController')

const router = express.Router()

// router.get('/', getAllProfiles);         //We should be getting only 1 profile. Not needed

router.get('/:id', getProfileById);     //Retrieve infomation based on logged in username and password using ID.

// router.post('/', createProfile);        //Create a new Account

// //router.delete('/:id', deleteProfile);   I assumed there is no deletion of accounts.

router.patch('/updatePassword/:email', updatePassword)     //Edit user profile

// Login Route
router.post('/login', loginUser)

// Signup Route
router.post('/signup', signupUser)

router.patch('/updateName/:email', updateName); // Updated route to use email


module.exports = router;
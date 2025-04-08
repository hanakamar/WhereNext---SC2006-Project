const express = require('express')

const { signupUser, loginUser, updatePassword, getProfileById, updateName } = require('../controllers/profileController')

const router = express.Router()



router.get('/:id', getProfileById);     //Retrieve infomation based on logged in username and password using ID.



router.patch('/updatePassword/:email', updatePassword)     //Edit user profile

// Login Route
router.post('/login', loginUser)

// Signup Route
router.post('/signup', signupUser)

router.patch('/updateName/:email', updateName); // Updated route to use email


module.exports = router;
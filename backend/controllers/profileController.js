const Profile = require('../models/ProfileModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" })
}

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const profile = await Profile.login(email, password)

        // Create a Token
        const token = createToken(profile._id)

        res.status(200).json({ status: "ok", email, token });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}


const signupUser = async (req, res) => {
    const { email, password, name, country } = req.body

    try {
        const profile = await Profile.signup(email, password, name, country);

        // Create a Token
        const token = createToken(profile._id);

        res.status(200).json({ status: "ok", email, token });
    } catch (error) {
        res.status(500).json({ message: error.message || "An unexpected error occurred" });
    }
}

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; // Extracted from JWT middleware

    try {
        // Find the user
        const profile = await Profile.findById(userId);
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, profile.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }


        // Save updated password
        const update = await Profile.updatePassword(oldPassword, newPassword);
        const token = createToken(update._id);

        res.status(200).json({ message: "Password updated successfully", token });
    } catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
};

module.exports = { signupUser, loginUser, updatePassword };
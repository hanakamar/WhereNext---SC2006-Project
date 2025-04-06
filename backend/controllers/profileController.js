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
    const { email } = req.params; // Extract email from query parameters

    try {
        // Find the user by email
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        // Call the instance method to update the password
        const result = await profile.updatePassword(oldPassword, newPassword);

        const token = createToken(profile._id);

        res.status(200).json({ message: result.message, token });
        console.log("Password updated successfully for email:", email);
    } catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
};

// Get All Profile (LoginUser)
const getProfileById = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email query parameter is required' });
    }

    try {
        const profiles = await Profile.find({ email }); // Retrieve profiles by email
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const updateName = async (req, res) => {
    const { newName } = req.body;
    const { email } = req.params; // Extracted from URL params

    try {
        // Find the user by email
        const profile = await Profile.findOne({ email });
        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the name
        profile.name = newName;
        await profile.save();

        res.status(200).json({ message: "Name updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "An error occurred" });
    }
};


module.exports = { signupUser, loginUser, updatePassword, getProfileById, updateName };
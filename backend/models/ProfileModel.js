const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const validator = require('validator');


const profileSchema = new Schema({

    email: {                     //Account username
        type: String,
        required: true,
        unique: true
    },
    password: {                     //Account password
        type: String,
        required: true
    },
    name: {                     //Account password
        type: String,
        required: true
    },
    country: {                     //Account password
        type: String,
        required: false
    }
})

// Sign Up Method
profileSchema.statics.signup = async function (email, password, name, country) {

    //Validation
    if (!email || !password || !name) {
        throw Error("All fields must be filled")
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough")
    }


    const exists = await this.findOne({
        $or: [
            { email: email }
        ]
    })

    if (exists) {
        throw Error("Email already in use!")
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const profile = await this.create({ email, password: hash, name, country })

    return profile
}


// Login Method
profileSchema.statics.login = async function (email, password) {

    //Validation
    if (!email || !password) {
        throw Error("All fields must be filled")
    }

    const profile = await this.findOne({ email })

    if (!profile) {
        throw Error("Email does not exist!")
    }

    // Plaintext password and Hash Password
    const match = await bcrypt.compare(password, profile.password);

    if (!match) {
        throw Error("Incorrect Password")
    }

    return profile

}

profileSchema.methods.updatePassword = async function (oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
        throw Error("Both old and new passwords are required.");
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, this.password);
    if (!isMatch) {
        throw Error("Incorrect old password");
    }

    // Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
        throw Error("New password is not strong enough");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(newPassword, salt);

    // Save the updated profile
    await this.save();

    return { message: "Password updated successfully" };
};

module.exports = mongoose.model('Profile', profileSchema);
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {type: String, required: true,unique: true},
    password: {type: String, requird: true},
    mobile: {type: Number, required: true},
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    role: {type: String, default: "User"}
})

const User = mongoose.model('User', userSchema);

module.exports = User
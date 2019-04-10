let mongoose = require("mongoose");

//Schema
let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: Array
    }
});

module.exports = mongoose.model('User', userSchema);
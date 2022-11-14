const mongoose = require('mongoose');
const db = require('../../config/db');

const UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password : {
        type: String,
        required: true,
        minLength: 6
    },

    token : {
        type: String
    }
});

const User = db.model("users", UserSchema);
module.exports = User;
const mongoose = require('mongoose');
const db = require('../config/db');

const bookSchema = new mongoose.Schema ({
    title: {
        type: String,
        default: '------'
    },

    isbn : {
        type: Number,
    },
    
    author : {
        type: String,
        default: '------'
    }
});

const bookModel= db.model("books", bookSchema);
module.exports = bookModel;

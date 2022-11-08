const mongoose= require('mongoose');

const uri= "mongodb://localhost:27017/booksDB";

const connection = mongoose.createConnection(uri);

module.exports = connection;
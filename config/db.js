const mongoose= require('mongoose');
const dotenv = require('dotenv').config();

const connection = mongoose.createConnection(process.env.URI);

module.exports = connection;
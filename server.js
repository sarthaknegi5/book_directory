const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const books = require('./src/routers/books');
const auth = require('./src/routers/auth');
const cookieParser = require('cookie-parser');
const userAuth = require('./middleware/userAuth');
const dotenv = require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', books);
app.use('/', auth);

app.get('/', (req, res) => {
    res.send('Welcome to my Book Shop REST API SERVER')
})

app.post('/welcome', userAuth, (req,res) =>  {
    res.status(200).json ({
       statusCode: 200,
       statusMessage: 'Welcome' 
    });
});

app.listen(process.env.PORT, '10.0.0.26', () => console.log(`App listening on port ${process.env.PORT}`));
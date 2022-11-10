const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const books = require('./routers/books');
const auth = require('./routers/auth');
const cookieParser = require('cookie-parser');
const userAuth = require('./middleware/userAuth');
const dotenv = require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', books);
app.use('/', auth);

app.post('/welcome', userAuth, (req,res) =>  {
    res.status(200).send("Welcome");
});

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));
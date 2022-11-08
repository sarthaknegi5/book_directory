const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const books = require('./routers/books');
const auth = require('./routers/auth');
const cookieParser = require('cookie-parser');
const userAuth = require('./middleware/userAuth');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', books);
app.use('/', auth);

app.post('/welcome', userAuth, (req,res) =>  {
    res.status(200).send("Welcome");
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
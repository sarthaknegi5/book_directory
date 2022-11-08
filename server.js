const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api');
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');

const userAuth = require('./middleware/userAuth');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', api);
app.use('/', auth);

app.post('/welcome', userAuth, (req,res) =>  {
    res.status(200).send("Welcome");
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
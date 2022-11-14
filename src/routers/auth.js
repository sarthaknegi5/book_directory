const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const auth = require('../controller/auth.controller')


router.get('/users', auth.getUsers);
router.get('/users/:uname', auth.getUserById);

router.post('/users/signup', auth.userSignup);
router.post('/users/login', auth.userLogin);
router.post('/refresh', auth.refreshToken);

router.put('/users/:uname', auth.userUpdate);

router.delete('/users/:uname', auth.userDelete);

module.exports = router;
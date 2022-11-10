const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyToken = (req,res,next) => {
    const accessToken = req.headers["authorization"];
    const token = accessToken.split(' ')[1];

    if(!token) {
        res.status(403).send("A token is required for authorization");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
    }

    catch(err) {
        res.status(401).send("Invalid token");
    }

    return next();

};

module.exports = verifyToken;
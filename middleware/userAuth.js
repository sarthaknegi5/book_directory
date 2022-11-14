const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const verifyToken = (req,res,next) => {
    const accessToken = req.headers["authorization"];
    const token = accessToken.split(' ')[1];

    if(!token) {
        res.status(403).json ( {
            statusCode : 403,
            statusMessage : 'A token is required for authorization'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
    }

    catch(err) {
        res.status(401).json( {
            statusCode: 401,
            statusMessage: 'Invalid token'
        });
    }

    return next();

};

module.exports = verifyToken;
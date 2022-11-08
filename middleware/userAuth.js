const jwt = require('jsonwebtoken');
const jwtSecret = '6b983ad6f9b8d990490e5a4bf6150ee9314a2a4b5248d73777ae94012d533b3ae52875';

const verifyToken = (req,res,next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token) {
        res.status(403).send("A token is required for authorization");
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
    }

    catch(err) {
        res.status(401).send("Invalid token");
    }

    return next();

};

module.exports = verifyToken;
const jwt = require("jsonwebtoken");
const config = require('config')

const auth = (req, res, next) => {
    const token = req.headers['x-auth-token']
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send("Invalid token");
    }
};

module.exports = auth;

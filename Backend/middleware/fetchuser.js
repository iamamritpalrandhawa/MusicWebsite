require('dotenv').config();
const jwt = require('jsonwebtoken');
const fetchuser = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please in authenticate using a valid token" });
    }

}

module.exports = fetchuser;
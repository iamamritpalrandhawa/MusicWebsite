import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const fetchuser = (req, res, next) => {
    //Get the user form the jwt token and add it to req object
    const token = req.header('auth-token');
    // console.log(token)
    if (!token) {
        // console.log(token);
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

export default fetchuser;
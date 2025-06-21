import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // import the User model
import 'dotenv/config';

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Check if user still exists
        const user = await User.findById(verified.id);
        if (!user) {
            return res.status(401).json({ message: 'Token is invalid — user does not exist' });
        }

        req.user = verified;
        req.userId = verified.id;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

export default verifyToken;

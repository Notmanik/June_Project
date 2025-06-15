import jwt from 'jsonwebtoken';
import 'dotenv/config';
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use env variable
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

export default verifyToken;
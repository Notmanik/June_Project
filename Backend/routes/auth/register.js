import bcrypt from 'bcrypt';
import User from '../../models/user.js'; // adjust path as needed

const registerUser = async (req, res) => {
    try {
        const { username, email, password, mobileNumber } = req.body;

        // Check if user already exists (email, username, etc.)
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            mobileNumber
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

export default registerUser;

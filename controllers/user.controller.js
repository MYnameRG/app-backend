const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const signUpUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const userExist = await User.findOne({ email: email });
        if (userExist != null) return res.status(500).json({ message: 'User already exist', isSuccess: false });

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);

        // Registered the user
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hash_password
        });

        await user.save();

        return res.status(200).json({ message: 'User signup successfully', isSuccess: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', isSuccess: false });
    }
};

const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (user == null) return res.status(400).json({ message: 'User not found', isSuccess: false });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Password not correct', isSuccess: false });

        // Generate the token
        const token = jwt.sign({ user_id: user._id.toString() }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ data: token, isSuccess: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal Server Error', isSuccess: false });
    }
};

module.exports = { signUpUser, logInUser };
const { validationResult } = require('express-validator');
const Account = require('../modal/auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { userId, password } = req.body;
        let user = undefined;

        if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userId)) {
            user = await Account.findOne({ email: userId });
        } else {
            user = await Account.findOne({ username: userId });
        }
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error occurred" });
    }
}

exports.createUser = async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const { username, email, password } = req.body;

        const existingUsername = await Account.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "Sorry, this username already exists" });
        }

        const existingEmail = await Account.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Sorry, this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await Account.create({ username, email, password: hashedPassword });

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({ success: true, authtoken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occurred" });
    }

}

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await Account.findById(userId).select('username email -_id recentSongIds');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal server error occurred" });
    }
}

exports.updateUsername = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username } = req.body;
        const userId = req.user.id;
        const user = await Account.findByIdAndUpdate(userId, { username }, { new: true });
        success = true;
        res.status(200).json({ success, msg: "Username updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal server error occurred" });
    }
}

exports.updatePassword = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oldpassword, newpassword } = req.body;
        const userId = req.user.id;

        // Fetch the user from the database
        const user = await Account.findById(userId);

        // Check if the provided old password matches the user's current password
        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success, errors: [{ msg: 'Invalid current password' }] });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();
        success = true;
        res.json({ success, msg: 'Password updated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal server error occurred" });
    }
}

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await Account.findOne({ username });
        if (user) {
            // Username is already taken
            res.json({ available: false });
        } else {
            // Username is available
            res.json({ available: true });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal server error occurred" });
    }
}
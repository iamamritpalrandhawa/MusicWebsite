import dotenv from "dotenv";
dotenv.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express from "express";
const router = express.Router()
import Account from "../modal/auth.mjs";
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from "../middleware/fetchuser.mjs";


// Rotue1 : Create a user using : POST "/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('username', 'Enter valid username').isLength({ min: 3 }),
    body('email', "Enter valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    //if error return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const { username, email, password, recentSongsIds } = req.body;

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

        const user = await Account.create({ username, email, password: hashedPassword, recentSongsIds: [recentSongsIds] });

        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({ success: true, authtoken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error occurred" });
    }

});

// Rotue 2 : Authenticate a user using: POST "/auth/login" . No login require

router.post('/login', [
    body('userId', "Enter valid User").exists(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { userId, password, recentSongsIds } = req.body;
        let user = undefined;

        if (/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userId)) {
            user = await Account.findOne({ email: userId });
        } else {
            user = await Account.findOne({ username: userId });
        }
        user.recentSongsIds = user.recentSongsIds.filter((id) => id != null);
        if (!user.recentSongsIds.includes(recentSongsIds)) {
            user.recentSongsIds.push(recentSongsIds);
        }
        await user.save();
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
        res.status(500).send("Internal server error occurred");
    }
});


// Route 3 : Getlogged in user details using id : get  "/auth/getuser. "
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await Account.findById(userId).select('username email recentSongsIds -_id');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }

})

// Route 4 : Update the user information using: PATCH  "/auth /updateusername. "
router.patch('/updateusername', [
    body('username', 'Enter valid username').isLength({ min: 3 })
], fetchuser, async (req, res) => {
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
        res.status(500).send("Internal Server Error.");
    }
})

//Route5: update Passowrd in user details using : patch "/auth/updatepassword"
router.patch('/updatepassword', [
    body('oldpassword', 'Enter your current password').notEmpty(),
    body('newpassword', 'Enter a new password with minimum 5 characters').isLength({ min: 5 }),
], fetchuser, async (req, res) => {
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
        res.status(500).send('Internal Server Error');
    }
});

// Route 6: Check if username is available using: Get "/checkusername/:username"
router.get('/checkusername/:username', fetchuser, async (req, res) => {
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
        res.status(500).send('Internal Server Error.');
    }
});

export default router;

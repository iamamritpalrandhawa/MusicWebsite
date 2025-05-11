require('dotenv').config();
const express = require('express');
const router = express.Router()
const { body } = require('express-validator');
const fetchuser = require("../middleware/fetchuser.js");
const { login, createUser, getUser, updateUsername, updatePassword, checkUsername } = require('../Controllers/authController.js');

// Rotue 1 : Create a user using : POST "/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('username', 'Enter valid username').isLength({ min: 3 }),
    body('email', "Enter valid email").isEmail(),
    body('password', "Enter valid password").isLength({ min: 5 }),
], createUser);

// Rotue 2 : Authenticate a user using: POST "/auth/login" . No login require
router.post('/login', [
    body('userId', "Enter valid User").exists(),
    body('password', 'Password cannot be blank').exists(),
], login);

// Route 3 : Getlogged in user details using id : get  "/auth/getuser."
router.post('/getuser', fetchuser, getUser);

// Route 4 : Update the user information using: PATCH  "/auth/updateusername."
router.patch('/updateusername', [
    body('username', 'Enter valid username').isLength({ min: 3 })
], fetchuser, updateUsername);

// Route 5 : update Passowrd in user details using : patch "/auth/updatepassword"
router.patch('/updatepassword', [
    body('oldpassword', 'Enter your current password').notEmpty(),
    body('newpassword', 'Enter a new password with minimum 5 characters').isLength({ min: 5 }),
], fetchuser, updatePassword);

// Route 6 : Check if username is available using: Get "/checkusername/:username"
router.get('/checkusername/:username', checkUsername);

module.exports = router;
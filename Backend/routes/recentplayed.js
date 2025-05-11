const fetchuser = require("../middleware/fetchuser");
const express = require("express");

const { addRecent, getRecents } = require("../Controllers/recentController");
const router = express.Router();

router.post('/add', fetchuser, addRecent);

router.get("/getrecents", fetchuser, getRecents);

module.exports = router;
// Importing necessary modules and the RecentPlayed model
import express from "express";
import RecentPlayed from "../modal/recentplayed.mjs";

// Creating an Express router
const router = express.Router();

// Handling the POST request
router.post('/add', async (req, res) => {
    try {
        // Extracting data from the request body
        const { id } = req.body;
        const recent = req.body.music;

        // Checking if the document with the given id exists
        let checkIsPresent = await RecentPlayed.findOne({ id });

        if (checkIsPresent) {
            // Copying the existing recent array and adding the new music
            let recents = Array.from(checkIsPresent.recent);

            let alreadyPresent = false;
            for (let i = 0; i < recents.length; i++) {
                if (recents[i].youtubeId == recent.youtubeId) {
                    alreadyPresent = true;
                    break;
                }
            }
            recents.push(recent);
            if (recents.length == 11) {
                recents.shift();
            }

            // Updating the document with the new recent array
            if (!alreadyPresent) {
                await RecentPlayed.findOneAndUpdate({ id }, { recent: recents }, { new: true });
                return res.status(200).json({ success: true, msg: "Song is added" });
            }
            else {
                return res.status(200).json({ success: false, msg: "Song is Already Exists" });
            }

            // Sending a success response
        } else {
            // If the document doesn't exist, create a new document
            await RecentPlayed.create({ id, recent });

            // Sending a success response
            return res.status(200).json({ success: true, msg: "Id is created. Song is added" });
        }
    } catch (error) {
        // Handling errors
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
});

router.post("/getrecents", async (req, res) => {
    try {
        // Extracting data from the request body
        const { id } = req.body;
        // Checking if the document with the given id exists
        let checkIsPresent = await RecentPlayed.findOne({ id });

        // Copying the existing recent array and adding the new music
        if (checkIsPresent) {
            let recents = Array.from(checkIsPresent.recent);
            return res.status(200).json(recents)
        }
        else {
            return res.status(200).json([])

        }
    }
    catch (error) {
        // Handling errors
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
})

// Exporting the router
export default router;

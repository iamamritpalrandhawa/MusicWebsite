const Account = require("../modal/auth.js");

exports.addRecent = async (req, res) => {
    try {
        // Extracting data from the request body
        const { id } = req.body;
        const userid = req.user.id;

        const user = await Account.findById({ _id: userid });

        // Copying the existing recent array and adding the new music
        let recents = Array.from(user.recentSongIds);

        let alreadyPresent = false;
        for (let i = 0; i < recents.length; i++) {
            if (recents[i] == id) {
                alreadyPresent = true;
                break;
            }
        }
        recents.push(id);
        if (recents.length == 11) {
            recents.shift();
        }

        // Updating the document with the new recent array
        if (!alreadyPresent) {
            user.recentSongIds = recents;
            await user.save();
            return res.status(200).json({ success: true, msg: "Song is added" });
        }
        else {
            return res.status(200).json({ success: false, msg: "Song is Already Exists" });
        }

    } catch (error) {
        // Handling errors
        console.error(error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}


exports.getRecents = async (req, res) => {
    try {
        const id = req.user.id;
        // Checking if the document with the given id exists
        let user = await Account.findOne({ _id: id });

        // Copying the existing recent array and adding the new music
        if (user) {
            let recents = Array.from(user.recentSongIds);
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
}
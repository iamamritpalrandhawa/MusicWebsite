import express from "express";
import { getSuggestions } from "node-youtube-music";
const router = express.Router();

function parseBetween(str, start, end) {
    return str.substring(
        str.lastIndexOf(start) + start.length,
        str.lastIndexOf(end)
    );
}

async function getVideo(id) {
    try {
        const response = await fetch("https://sound-scribe.vercel.app/songs/id/" + id);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null; // Return null on error
    }
}

async function parseVideoIDs(data) {
    try {
        const item = data.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items;
        const videoIDs = await Promise.all(item.map(async (element) => {
            return await getVideo(element.videoRenderer.videoId);
        }));
        return videoIDs;
    } catch (error) {
        console.error("Error parsing video IDs:", error);
        return []; // Return empty array on error
    }
}

router.get('/trending', async (req, res) => {
    try {
        const response = await fetch("https://www.youtube.com/feed/trending?bp=4gINGgt5dG1hX2NoYXJ0cw%3D%3D");
        const html = await response.text();
        const data = JSON.parse(parseBetween(html, "var ytInitialData = ", ";</script><script nonce="));
        const trending = await parseVideoIDs(data);
        res.json(trending);
    } catch (error) {
        console.error("Error fetching trending videos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/getsuggestion", async (req, res) => {
    try {
        let userId = req.body.id;
        let json = [];
        try {
            const response = await fetch("https://sound-scribe.vercel.app/recentplayed/getrecents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: userId }),
            });
            json = await response.json();
            if (json.length === 0) {
                res.status(200).json([]);
            }
        } catch (error) {
            res.status(200).json([]);
        }
        const result1 = await Promise.all(json.map(async (element) => {
            const suggestions = await getSuggestions(element.youtubeId);
            return suggestions[1];
        }));
        const result2 = await Promise.all(json.map(async (element) => {
            const suggestions = await getSuggestions(element.youtubeId);
            return suggestions[2];
        }));
        result1.push(...result2);
        const uniqueYouTubeIds = new Set();

        // Filter out duplicate entries based on YouTube IDs
        const uniqueSongs = result1.filter(song => {
            if (uniqueYouTubeIds.has(song.youtubeId)) {
                return false; // Skip if YouTube ID is already encountered
            } else {
                uniqueYouTubeIds.add(song.youtubeId); // Add the YouTube ID to the set
                return true; // Include this song in the unique list
            }
        });
        res.json(uniqueSongs);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;

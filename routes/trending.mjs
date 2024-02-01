import express from "express";
// import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests
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

export default router;

import express from "express";
const router = express.Router();
import {
  searchMusics,
  getSuggestions,
  searchAlbums,
  listMusicsFromAlbum,
} from "node-youtube-music";

router.get("/id/:youtubeId", async (req, res) => {
  if (req.params.youtubeId) {
    const suggestions = await getSuggestions(req.params.youtubeId);
    res.json(suggestions[0]);
  } else {
    res.json({ error: "Enter some Id" });
  }
});

router.get("/name/:youtubename", async (req, res) => {
  if (req.params.youtubename) {
    const musics = await searchMusics(req.params.youtubename);
    res.json(musics);
  } else {
    res.json({ error: "Enter some Name" });
  }
});

router.get("/getalbums/:albumname", async (req, res) => {
  if (req.params.albumname) {
    const albums = await searchAlbums(req.params.albumname);
    res.json(albums);
  } else {
    res.json({ error: "Enter some playlist Name" });
  }
});

router.get("/albumid/:albumId", async (req, res) => {
  if (req.params.albumId) {
    const albumSongs = await listMusicsFromAlbum(req.params.albumId);
    res.json(albumSongs);
  } else {
    res.json({ error: "Enter some playlist Id" });
  }
});

export default router;

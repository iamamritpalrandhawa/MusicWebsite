import express from "express";
const router = express.Router();
import {
  searchMusics,
  getSuggestions,
  searchAlbums,
  listMusicsFromAlbum,
  searchArtists,
  getArtist,
  searchPlaylists,
  listMusicsFromPlaylist
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
    res.json({ error: "Enter some Album Name" });
  }
});

router.get("/albumid/:albumId", async (req, res) => {
  if (req.params.albumId) {
    const albumSongs = await listMusicsFromAlbum(req.params.albumId);
    res.json(albumSongs);
  } else {
    res.json({ error: "Enter some Album Id" });
  }
});

router.get("/getartist/:artistname", async (req, res) => {
  if (req.params.artistname) {
    const artist = await searchArtists(req.params.artistname);
    res.json(artist);
  } else {
    res.json({ error: "Enter some Artist Name" });
  }
});

router.get("/artistid/:artistId", async (req, res) => {
  if (req.params.artistId) {
    const artist = await getArtist(req.params.artistId);
    res.json(artist);
  } else {
    res.json({ error: "Enter some Artist Id" });
  }
});
router.get("/getplaylist/:playlistname", async (req, res) => {
  if (req.params.playlistname) {
    const playlist = await searchPlaylists(req.params.playlistname);
    res.json(playlist);
  } else {
    res.json({ error: "Enter some Playlist Name" });
  }
});

router.get("/playlistid/:playlistId", async (req, res) => {
  if (req.params.playlistId) {
    const playlist = await listMusicsFromPlaylist(req.params.playlistId);
    res.json(playlist);
  } else {
    res.json({ error: "Enter some Playlist Id" });
  }
});

export default router;

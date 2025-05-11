const express = require("express");
const router = express.Router();
const { searchForMusic,
    searchForArtists,
    searchForAlbums,
    searchForPlaylists,
    getMusicBasedSuggestions,
    getPlaylist,
    listMusicFromAlbum,
    listMusicFromPlaylist,
    getArtist,
    getMusic,
    getNewReleased
} = require("youtube-music-apis");


router.get("/id/:youtubeId", async (req, res) => {
    if (req.params.youtubeId) {
        const musicDetails = await getMusic(req.params.youtubeId)
        res.json(musicDetails);
    } else {
        res.json({ error: "Enter some Id" });
    }
});

router.get("/name/:youtubename", async (req, res) => {
    if (req.params.youtubename) {
        const musics = await searchForMusic(req.params.youtubename);
        res.json(musics);
    } else {
        res.json({ error: "Enter some Name" });
    }
});

router.get("/getalbums/:albumname", async (req, res) => {
    if (req.params.albumname) {
        const albums = await searchForAlbums(req.params.albumname);
        res.json(albums);
    } else {
        res.json({ error: "Enter some Album Name" });
    }
});

router.get("/albumid/:albumId", async (req, res) => {
    if (req.params.albumId) {
        const albumSongs = await listMusicFromAlbum(req.params.albumId);
        res.json(albumSongs);
    } else {
        res.json({ error: "Enter some Album Id" });
    }
});

router.get("/getartist/:artistname", async (req, res) => {
    if (req.params.artistname) {
        const artist = await searchForArtists(req.params.artistname);
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
        const playlist = await searchForPlaylists(req.params.playlistname);
        res.json(playlist);
    } else {
        res.json({ error: "Enter some Playlist Name" });
    }
});

router.get('/playlistid/:playlistId', async (req, res) => {
    if (req.params.playlistId) {
        console.log(req.params.playlistId);
        const playlist = await getPlaylist(req.params.playlistId);
        res.json(playlist);
    } else {
        res.json({ error: "Enter some Playlist Id" });
    }
});

router.get("/playlistsongsid/:playlistId", async (req, res) => {
    if (req.params.playlistId) {
        const playlist = await listMusicFromPlaylist(req.params.playlistId);
        res.json(playlist);
    } else {
        res.json({ error: "Enter some Playlist Id" });
    }
});

router.get("/suggestions/:musicId", async (req, res) => {
    if (req.params.musicId) {
        const suggestions = await getMusicBasedSuggestions(req.params.musicId);
        res.json(suggestions);
    } else {
        res.json({ error: "Enter some Music Id" });
    }
});

router.get('/trending', async (req, res) => {
    try {
        const trending = await getNewReleased();
        res.json(trending);
    } catch {
        res.json({ error: "Some Error Occured" });
    }
});
module.exports = router;
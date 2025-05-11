const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

const connectToMongo = require('./db');
connectToMongo();

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/auth', require('./routes/auth'));
app.use('/recentplayed', require('./routes/recentplayed'));
app.use('/songs', require('./routes/songs'));

app.get('/stream/:videoId', async (req, res) => {
    const { videoId } = req.params;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        const stream = ytdl(url, {
            quality: 'highestaudio',
            filter: 'audioonly',
            highWaterMark: 1 << 25,
            liveBuffer: 2000,
        });
        res.setHeader('Content-Type', 'audio/webm');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Accept-Ranges', 'bytes');
        stream.pipe(res);

        stream.on('error', (err) => {
            console.error('Stream error:', err);
            if (!res.headersSent) res.status(500).send('Stream error');
            else res.end();
        });

    } catch (err) {
        console.error('Failed to stream:', err);
        res.status(500).send('Could not stream audio');
    }
});

module.exports = app;
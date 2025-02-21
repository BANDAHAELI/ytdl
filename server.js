const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.get('/download', async (req, res) => {
    const videoURL = req.query.url;
    if (!ytdl.validateURL(videoURL)) {
        return res.status(400).send('Invalid YouTube URL');
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        res.json({ downloadURL: format.url });
    } catch (error) {
        res.status(500).send('Error fetching video info');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

import express from "express";
import { exec } from "child_process";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("YT-DLP API is running! Use /download?url=YOUR_YOUTUBE_LINK");
});

// Download route
app.get("/download", async (req, res) => {
    let url = req.query.url;
    if (!url) return res.status(400).send("❌ Please provide a YouTube URL!");

    let outputFile = "output.mp3";

    exec(`./bin/yt-dlp -f "bestaudio" -o ${outputFile} ${url}`, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
            return res.status(500).send("❌ Error downloading video.");
        }

        res.download(outputFile, "audio.mp3", (err) => {
            if (err) console.error(err);
            fs.unlinkSync(outputFile); // Delete file after sending
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

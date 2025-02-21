// Sarkar-MD
import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("YouTube Video & Audio Downloader API");
});

app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(url);
    const format = req.query.format || "video"; // video or audio
    let stream;

    if (format === "audio") {
      stream = ytdl(url, { quality: "highestaudio", filter: "audioonly" });
      res.header("Content-Disposition", `attachment; filename="${info.videoDetails.title}.mp3"`);
    } else {
      stream = ytdl(url, { quality: "highestvideo" });
      res.header("Content-Disposition", `attachment; filename="${info.videoDetails.title}.mp4"`);
    }

    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// POWERED BY BANDAHEALI

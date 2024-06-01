import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const { videoId } = req.query;
  if (!videoId || typeof videoId !== "string")
    return res.status(400).json({ message: "No videoId provided" });
  const endpoint =
    "https://www.googleapis.com/youtube/v3/videos?" +
    new URLSearchParams({
      id: videoId,
      key: "AIzaSyC8i3iladt3Zk9yKujaIGHxs6YBsKb5PyE",
      part: "snippet,contentDetails",
    });

  const response = await fetch(endpoint);
  const data = await response.json();
  const duration = data.items[0].contentDetails.duration;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1], 10) || 0;
  const minutes = parseInt(match[2], 10) || 0;
  const seconds = parseInt(match[3], 10) || 0;
  const durationInSeconds = hours * 3600 + minutes * 60 + seconds;

  res.status(200).json({
    title: data.items[0].snippet.title,
    duration: durationInSeconds,
    thumbnail: data.items[0].snippet.thumbnails.default.url,
    id: videoId,
  });
}

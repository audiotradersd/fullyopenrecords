/** Returns YouTube's public high-quality thumbnail for a recognised video URL. */
export function getYouTubeThumbnail(videoUrl?: string | null) {
  if (!videoUrl) return null;

  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      videoId = url.searchParams.get("v") ?? "";
      if (!videoId) {
        const [pathType, pathId] = url.pathname.split("/").filter(Boolean);
        if (pathType === "embed" || pathType === "shorts" || pathType === "live") videoId = pathId ?? "";
      }
    }

    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

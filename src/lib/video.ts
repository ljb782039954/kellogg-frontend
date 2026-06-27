export type SafeVideoSource =
  | { kind: "embed"; provider: "youtube" | "vimeo" | "facebook" | "tiktok"; url: string; vertical?: boolean }
  | { kind: "video"; provider: "direct"; url: string };

const VIDEO_ID = /^[a-zA-Z0-9_-]{6,32}$/;

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function isHost(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

export function getSafeVideoSource(rawUrl: string, assetsBase?: string): SafeVideoSource | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = normalizeHost(url.hostname);
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (isHost(host, "youtube.com") || isHost(host, "youtube-nocookie.com") || host === "youtu.be") {
    const videoId = host === "youtu.be"
      ? pathParts[0]
      : pathParts[0] === "shorts" || pathParts[0] === "embed"
        ? pathParts[1]
        : url.searchParams.get("v");
    if (!videoId || !VIDEO_ID.test(videoId)) return null;
    return {
      kind: "embed",
      provider: "youtube",
      url: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
      ...(pathParts[0] === "shorts" ? { vertical: true } : {}),
    };
  }

  if (isHost(host, "vimeo.com")) {
    const videoId = pathParts.find((part) => /^\d+$/.test(part));
    if (!videoId) return null;
    return { kind: "embed", provider: "vimeo", url: `https://player.vimeo.com/video/${videoId}` };
  }

  if (isHost(host, "tiktok.com")) {
    const videoIndex = pathParts.indexOf("video");
    const videoId = videoIndex >= 0 ? pathParts[videoIndex + 1] : undefined;
    if (!videoId || !/^\d+$/.test(videoId)) return null;
    return { kind: "embed", provider: "tiktok", url: `https://www.tiktok.com/embed/v2/${videoId}`, vertical: true };
  }

  if (isHost(host, "facebook.com") || host === "fb.watch") {
    return {
      kind: "embed",
      provider: "facebook",
      url: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url.toString())}&show_text=0`,
    };
  }

  if (assetsBase) {
    try {
      const assetsUrl = new URL(assetsBase);
      if (normalizeHost(assetsUrl.hostname) === host && /\.(mp4|webm|ogg)$/.test(url.pathname.toLowerCase())) {
        return { kind: "video", provider: "direct", url: url.toString() };
      }
    } catch {
      return null;
    }
  }

  return null;
}

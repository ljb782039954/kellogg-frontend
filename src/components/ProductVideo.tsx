import { Play } from "lucide-react";

interface ProductVideoProps {
  url: string;
}

function getEmbedInfo(url: string) {
  try {
    const videoUrl = new URL(url);
    const host = videoUrl.hostname.toLowerCase();
    const path = videoUrl.pathname;

    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      const isShorts = path.startsWith("/shorts/");
      const videoId = host.includes("youtu.be")
        ? path.slice(1)
        : isShorts
          ? path.split("/shorts/")[1].split("/")[0]
          : videoUrl.searchParams.get("v") || "";
      return {
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
        platform: "youtube",
        isVertical: isShorts,
      };
    }

    if (host.includes("facebook.com")) {
      return {
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`,
        platform: "facebook",
        isVertical: false,
      };
    }

    if (host.includes("tiktok.com") && path.includes("/video/")) {
      const videoId = path.split("/video/")[1].split("?")[0];
      return {
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        platform: "tiktok",
        isVertical: true,
      };
    }

    if (host.includes("twitter.com") || host.includes("x.com")) {
      return { embedUrl: url, platform: "x", isVertical: false };
    }
  } catch {
    // Fall through to a normal external link.
  }

  return { embedUrl: url, platform: "other", isVertical: false };
}

export default function ProductVideo({ url }: ProductVideoProps) {
  const { embedUrl, platform, isVertical } = getEmbedInfo(url);
  const embeddedPlatforms = ["youtube", "facebook", "tiktok"];
  const platformConfig: Record<string, { label: string; className: string; icon: string }> = {
    x: { label: "Watch on X", className: "bg-[#000000]", icon: "X" },
    tiktok: { label: "Watch on TikTok", className: "bg-[#000000]", icon: "♪" },
    facebook: { label: "Watch on Facebook", className: "bg-[#1877F2]", icon: "f" },
    other: { label: "Watch Video", className: "bg-gray-900", icon: "▶" },
  };
  const config = platformConfig[platform] || platformConfig.other;

  if (embeddedPlatforms.includes(platform)) {
    return (
      <div className={`relative rounded-[32px] overflow-hidden bg-black shadow-2xl border border-gray-100 transition-all duration-700 ease-in-out ${isVertical ? "aspect-[9/16] max-w-[420px] mx-auto" : "aspect-video"}`}>
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Product Video"
        />
      </div>
    );
  }

  if (url.endsWith(".mp4") || url.endsWith(".webm")) {
    return (
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
        <video src={url} controls className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative aspect-video rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4 transition-all hover:opacity-90 shadow-2xl ${config.className}`}
    >
      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all border border-white/20">
        <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold text-2xl mb-1">{config.icon}</span>
        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </a>
  );
}

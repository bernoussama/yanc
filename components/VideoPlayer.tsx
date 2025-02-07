"use client";
import { cn } from "@/lib/utils";
import { getEmbedUrl, Provider } from "@/lib/providers";
import { Button } from "./ui/button";
import { useState } from "react";

interface VideoPlayerProps {
  type: "tv" | "movie";
  id: string; // TMDB ID as string
  imdbId?: string; // IMDB ID, optional
  seasonNumber?: string;
  episodeNumber?: string;
  className?: string;
  initialProvider?: Provider; // Optional, default to "vidsrc"
}

function VideoPlayer({
  type,
  id,
  imdbId,
  seasonNumber,
  episodeNumber,
  className,
  initialProvider = "2embed",
}: VideoPlayerProps) {
  const [provider, setProvider] = useState<Provider>(initialProvider);
  let url: string;

  try {
    url = getEmbedUrl(provider, {
      type,
      id,
      imdbId,
      seasonNumber,
      episodeNumber,
    });
  } catch (error) {
    console.error("Error generating embed URL:", error);
    const message = error instanceof Error ? error.message : String(error);
    return <div>Error generating embed URL: {message}</div>;
  }

  const toggleProvider = () => {
    setProvider((current) => (current === "2embed" ? "vidsrc" : "2embed"));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleProvider}
          className="text-xs"
        >
          Switch to {provider === "2embed" ? "VidSrc" : "2Embed"}
        </Button>
      </div>
      <iframe
        src={url}
        allowFullScreen
        className={cn(
          "aspect-video w-full rounded-lg border border-border/50",
          className,
        )}
      />
    </div>
  );
}

export default VideoPlayer;

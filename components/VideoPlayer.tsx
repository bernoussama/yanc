"use client";
import { cn } from "@/lib/utils";
import { getEmbedUrl, Provider } from "@/lib/providers";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useMemo } from "react";

interface VideoPlayerProps {
  type: "tv" | "movie";
  id: string; // TMDB ID as string
  imdbId?: string; // IMDB ID, optional
  seasonNumber?: string;
  episodeNumber?: string;
  className?: string;
  initialProvider?: Provider;
  totalSeasons?: number; // Total number of seasons
  episodesPerSeason?: Record<number, number>; // Number of episodes per season
}

function VideoPlayer({
  type,
  id,
  imdbId,
  seasonNumber: initialSeasonNumber = "1",
  episodeNumber: initialEpisodeNumber = "1",
  className,
  initialProvider = "2embed",
  totalSeasons = 1,
  episodesPerSeason = { 1: 1 },
}: VideoPlayerProps) {
  const [provider, setProvider] = useState<Provider>(initialProvider);

  // Only initialize TV-specific state and logic if type is "tv"
  const isTvShow = type === "tv";
  const [showControls, setShowControls] = useState(false);
  const [seasonNumber, setSeasonNumber] = useState(
    isTvShow ? initialSeasonNumber : "1",
  );
  const [episodeNumber, setEpisodeNumber] = useState(
    isTvShow ? initialEpisodeNumber : "1",
  );

  // Only compute TV-specific options if it's a TV show
  const seasonOptions = useMemo(
    () =>
      isTvShow
        ? Array.from({ length: totalSeasons }, (_, i) => ({
            value: String(i + 1),
            label: `Season ${i + 1}`,
          }))
        : [],
    [isTvShow, totalSeasons],
  );

  const episodeOptions = useMemo(() => {
    if (!isTvShow) return [];
    const episodeCount = episodesPerSeason[Number(seasonNumber)] || 1;
    return Array.from({ length: episodeCount }, (_, i) => ({
      value: String(i + 1),
      label: `Episode ${i + 1}`,
    }));
  }, [isTvShow, episodesPerSeason, seasonNumber]);

  // URL generation
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

  const handleSeasonChange = (value: string) => {
    setSeasonNumber(value);
    setEpisodeNumber("1"); // Reset episode when season changes
  };

  const handleEpisodeChange = (value: string) => {
    setEpisodeNumber(value);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => isTvShow && setShowControls(true)}
      onMouseLeave={() => isTvShow && setShowControls(false)}
    >
      <iframe
        src={url}
        allowFullScreen
        className={cn(
          "aspect-video w-full rounded-lg border border-border/50",
          className,
        )}
      />

      {/* Provider switch button */}
      <div
        className={`absolute right-4 top-4 transition-all duration-200 ${
          showControls || !isTvShow
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={toggleProvider}
          className="bg-black/80 text-xs backdrop-blur-sm hover:bg-black/90"
        >
          Switch to {provider === "2embed" ? "VidSrc" : "2Embed"}
        </Button>
      </div>

      {/* Season and Episode selectors - Only render for TV shows */}
      {isTvShow && (
        <div
          className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-4 rounded-lg bg-black/80 p-4 backdrop-blur-sm transition-all duration-200 ${
            showControls
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2">
            <Select value={seasonNumber} onValueChange={handleSeasonChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                {seasonOptions.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={episodeNumber} onValueChange={handleEpisodeChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select episode" />
              </SelectTrigger>
              <SelectContent>
                {episodeOptions.map((episode) => (
                  <SelectItem key={episode.value} value={episode.value}>
                    {episode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;

export const runtime = "edge";

import VideoPlayer from "@/components/VideoPlayer";
import { getTvShowById } from "@/lib/tmdb";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
    season: string;
    episode: string;
  };
}

export default async function EpisodePage({ params }: PageProps) {
  try {
    const { id, season, episode } = params;

    // Fetch show data to get season information
    const show = await getTvShowById(id);
    if (!show) {
      notFound();
    }

    // Calculate total seasons and episodes per season
    const totalSeasons = show.seasons.filter((s) => s.season_number > 0).length;

    const episodesPerSeason = show.seasons
      .filter((s) => s.season_number > 0)
      .reduce(
        (acc, s) => ({
          ...acc,
          [s.season_number]: s.episode_count,
        }),
        {} as Record<number, number>,
      );

    return (
      <div className=" container h-auto mx-auto w-screen mt-16">
        <VideoPlayer
          type="tv"
          id={id}
          seasonNumber={season}
          episodeNumber={episode}
          totalSeasons={totalSeasons}
          episodesPerSeason={episodesPerSeason}
          className="h-full w-full"
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading episode:", error);
    notFound();
  }
}

import { Button } from "@/components/ui/button";
import { getTvShowById, getSeasonDetails } from "@/lib/tmdb";

import { getImageUrl } from "@/lib/utils";
import { Calendar, Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";



// export async function generateStaticParams({
//   params: { id },
// }: {
//   params: { id: string };
// }) {
//   try {
//     const show = await getTvShowById(id);
//     return (
//       show.seasons
//         //.filter(season => season.air_date) // Only include seasons with air dates
//         .map((season) => ({
//           seasonNumber: season.season_number.toString(),
//         }))
//     );
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// }

async function SeasonPage({
  params,
}: {
  params: Promise<{ id: string; season: string }>;
}) {
  try {
    const { id, season: seasonNumber } = await params;
    const [show, season] = await Promise.all([
      getTvShowById(id),
      getSeasonDetails(id, seasonNumber),
    ]);

    // Validate that the season exists and has episodes
    if (!season || !season.episodes) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          {/* Season Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-none">
              <div className="relative w-[300px] h-[450px] rounded-lg overflow-hidden">
                {season.poster_path ? (
                  <Image
                    src={getImageUrl(season.poster_path, "original")!}
                    alt={season.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-card flex items-center justify-center">
                    <span className="text-muted-foreground">
                      No poster available
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <Link
                href={`/tv/${id}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {show.name}
              </Link>
              <h1 className="text-4xl font-bold mt-2 mb-4">{season.name}</h1>
              <div className="flex gap-4 items-center text-sm text-muted-foreground mb-6">
                {season.air_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(season.air_date).getFullYear()}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {season.episodes.length} Episodes
                </div>
              </div>
              <p className="text-lg mb-8">
                {season.overview || "No overview available."}
              </p>
            </div>
          </div>

          {/* Episodes List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Episodes</h2>
            <div className="grid gap-4">
              {season.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-card rounded-lg overflow-hidden border border-border/50"
                >
                  <div className="flex flex-col md:flex-row h-[169px]">
                    {episode.still_path ? (
                      <div className="relative min-w-[300px] max-w-[300px]  ">
                        <Image
                          src={getImageUrl(episode.still_path)!}
                          alt={episode.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-[300px] h-[169px] bg-card flex items-center justify-center">
                        <span className="text-muted-foreground">
                          No preview available
                        </span>
                      </div>
                    )}
                    <div className="p-6 flex-grow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {episode.episode_number}. {episode.name}
                          </h3>
                          <div className="flex gap-4 items-center text-sm text-muted-foreground mb-4">
                            {episode.air_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(
                                  episode.air_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {episode.vote_average > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                {episode.vote_average.toFixed(1)}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button asChild>
                          <Link
                            href={`/tv/${id}/${seasonNumber}/${episode.episode_number}`}
                          >
                            Play
                          </Link>
                        </Button>
                      </div>
                      <p className="text-muted-foreground">
                        {episode.overview || "No overview available."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}

export default SeasonPage;

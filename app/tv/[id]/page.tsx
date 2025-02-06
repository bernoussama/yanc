import { Button } from "@/components/ui/button";
import {
  getImageUrl,
  getTvShowById,
  getTrendingTvShows,
  getPopularTvShows,
} from "@/lib/tmdb";
import { Calendar, Star, Tv } from "lucide-react";
import WatchNowButton from "@/components/WatchNowButton";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";

// Generate static params for all TV show pages at build time
export async function generateStaticParams() {
  // Fetch all TV shows that we want to pre-render
  const [trending, popular] = await Promise.all([
    getTrendingTvShows(),
    getPopularTvShows(),
  ]);

  // Combine all shows and remove duplicates
  const allShows = [...trending, ...popular];
  const uniqueShows = Array.from(new Set(allShows.map((show) => show.id))).map(
    (id) => ({ id: id.toString() }),
  );

  return uniqueShows;
}

async function TvShowPage({ params }: { params: { id: string } }) {
  const show = await getTvShowById(params.id);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <Image
          src={getImageUrl(show.backdrop_path, "original")!}
          alt={show.name}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent pt-24">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{show.name}</h1>
            {show.tagline && (
              <p className="text-xl text-muted-foreground mb-4">
                {show.tagline}
              </p>
            )}

            <div className="flex gap-4 items-center text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(show.first_air_date).getFullYear()}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {show.vote_average.toFixed(1)} ({show.vote_count} votes)
              </div>
              <div className="flex items-center gap-1">
                <Tv className="w-4 h-4" />
                {show.number_of_seasons} Seasons
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-lg max-w-2xl mb-8">{show.overview}</p>
          </div>
        </div>
      </div>

      <div className="container pl-24">
        <WatchNowButton id={params.id} />
      </div>
      {/* Seasons Section */}
      <div className="container mx-auto px-8 py-12">
        <h2 className="text-3xl font-semibold mb-6">Seasons</h2>
        <ScrollArea>
          <div className="flex gap-6 pb-4">
            {show.seasons.map((season) => (
              <Link
                key={season.id}
                href={`/tv/${show.id}/${season.season_number}`}
                className="flex-none group"
              >
                <div className="w-[200px] bg-card rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <div className="relative h-[300px]">
                    <Image
                      src={getImageUrl(season.poster_path)!}
                      alt={season.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{season.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {season.episode_count} Episodes •{" "}
                      {new Date(season.air_date).getFullYear()}
                    </p>
                    <p className="text-sm line-clamp-2">
                      {season.overview || "No overview available."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </main>
  );
}

export default TvShowPage;

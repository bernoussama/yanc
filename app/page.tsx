// Cache this page for 24 hours (86400 seconds)
export const revalidate = 86400;
export const runtime = "edge";

// import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlayCircle, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getTrendingMovies,
  getPopularMovies,
  getUpcomingMovies,
  type Movie,
} from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";
import Card from "@/components/card";

async function getMovies() {
  const [trending, popular, upcoming] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getUpcomingMovies(),
  ]);

  return {
    trending,
    popular,
    upcoming,
  };
}

export default async function Home() {
  // const session = await auth();
  // console.log(session!);
  const { trending, popular, upcoming } = await getMovies();
  const heroMovie = trending[0];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <Image
          src={getImageUrl(heroMovie.backdrop_path, "original")!}
          alt={heroMovie.title}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent pt-24">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroMovie.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6">
            {heroMovie.overview}
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href={`/movie/${heroMovie.id}`}>
                <PlayCircle className="w-5 h-5" /> Play Now
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href={`/movie/${heroMovie.id}`}>
                <Info className="w-5 h-5" /> More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-8 space-y-8">
        <MovieSection title="Trending Now" movies={trending} />
        <MovieSection title="Popular on MovieFlix" movies={popular} />
        <MovieSection title="Upcoming Movies" movies={upcoming} />
      </div>
    </main>
  );
}

function MovieSection({ title, movies }: { title: string; movies: Movie[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ScrollArea>
        <div className="flex gap-4 pb-4">
          {movies.map((movie) => (
            <Card key={movie.id} item={movie} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

import { auth } from "@/auth";

export const runtime = "edge";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlayCircle, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getTrendingMovies,
  getPopularMovies,
  getUpcomingMovies,
  getImageUrl,
  type Movie,
} from "@/lib/tmdb";
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
  const session = await auth();
  console.log(session!);
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

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="relative group w-48 h-72 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
    >
      <div className="relative w-full h-full">
        <Image
          src={getImageUrl(movie.poster_path)!}
          alt={movie.title}
          fill
          className="rounded-sm object-cover md:rounded"
        />
      </div>
      <div className="absolute w-full h-full inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="">
          <h3 className="text-white font-medium">{movie.title}</h3>
          <p className="text-sm text-white/70">
            {new Date(movie.release_date).getFullYear()}
            {" • "}
            {movie.vote_average.toFixed(1)} ★
          </p>
        </div>
      </div>
    </Link>
  );
}

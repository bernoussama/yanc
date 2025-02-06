import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlayCircle, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getTrendingTvShows,
  getPopularTvShows,
  getImageUrl,
  type TvShow,
} from "@/lib/tmdb";
import Card from "@/components/card";

async function getTvShows() {
  const [trending, popular] = await Promise.all([
    getTrendingTvShows(),
    getPopularTvShows(),
  ]);

  return {
    trending,
    popular,
  };
}

export default async function TvShowsPage() {
  const { trending, popular } = await getTvShows();
  const heroShow = trending[0];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <Image
          src={getImageUrl(heroShow.backdrop_path, "original")!}
          alt={heroShow.name}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent pt-24">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {heroShow.name}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6">
            {heroShow.overview}
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href={`/tv/${heroShow.id}`}>
                <PlayCircle className="w-5 h-5" /> Watch Now
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <Link href={`/tv/${heroShow.id}`}>
                <Info className="w-5 h-5" /> More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-8 space-y-8">
        <TvShowSection title="Trending Now" shows={trending} />
        <TvShowSection title="Popular on MovieFlix" shows={popular} />
      </div>
    </main>
  );
}

function TvShowSection({ title, shows }: { title: string; shows: TvShow[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ScrollArea>
        <div className="flex gap-4 pb-4">
          {shows.map((show) => (
            <Card key={show.id} item={show} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function TvShowCard({ show }: { show: TvShow }) {
  return (
    <Link href={`/tv/${show.id}`} className="relative group block">
      <div className="w-[200px] h-[300px] relative rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <Image
          src={getImageUrl(show.poster_path)!}
          alt={show.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="space-y-1">
          <h3 className="text-white font-medium">{show.name}</h3>
          <p className="text-sm text-white/70">
            {new Date(show.first_air_date).getFullYear()}
            {" • "}
            {show.vote_average.toFixed(1)} ★
          </p>
        </div>
      </div>
    </Link>
  );
}

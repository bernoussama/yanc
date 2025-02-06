import { Button } from "@/components/ui/button";
import { getMovieById } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";
import { Clock, Calendar, Star, PlayCircle } from "lucide-react";
import Image from "next/image";

export const runtime = "edge";

// Generate static params for all movie pages at build time
// export async function generateStaticParams() {
//   // Fetch all movies that we want to pre-render
//   const [trending, popular, upcoming] = await Promise.all([
//     getTrendingMovies(),
//     getPopularMovies(),
//     getUpcomingMovies(),
//   ]);
//
//   // Combine all movies and remove duplicates
//   const allMovies = [...trending, ...popular, ...upcoming];
//   const uniqueMovies = Array.from(
//     new Set(allMovies.map((movie) => movie.id)),
//   ).map((id) => ({ id: id.toString() }));
//
//   return uniqueMovies;
// }

// This becomes a static page
async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);

  return (
    <main className="min-h-screen h-auto bg-background pb-8">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <Image
          src={getImageUrl(movie.backdrop_path, "original")!}
          alt={movie.title}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background to-transparent pt-24">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-xl text-muted-foreground mb-4">
                {movie.tagline}
              </p>
            )}

            <div className="flex gap-4 items-center text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {movie.runtime} min
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-lg max-w-2xl mb-8">{movie.overview}</p>

            <Button size="lg" className="gap-2">
              <PlayCircle className="w-5 h-5" /> Play Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 h-auto w-full">
        <iframe
          src={`https://vidsrc.to/embed/movie/${movie.id}`}
          allowFullScreen
          className="rounded-lg border-0 w-full h-full aspect-[21/9]"
        ></iframe>
      </div>
    </main>
  );
}

export default MoviePage;

export const runtime = "edge";

import { Suspense } from "react";
import { searchMulti, type SearchResult } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Star, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// type SearchParams = Promise<{ q?: string; page?: string }>;

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

async function SearchResults({ query, page }: { query: string; page: number }) {
  const data = await searchMulti(query, +page!);
  const results = data.results.filter(
    (result) => result.media_type === "movie" || result.media_type === "tv",
  );

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No results found for &quot;{query}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((result) => (
          <SearchResultCard
            key={`${result.media_type}-${result.id}`}
            result={result}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-6">
        <div className="text-sm text-muted-foreground">
          Page {page} of {data.total_pages}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild>
            <Link
              href={{
                pathname: "/search",
                query: { q: query, page: page - 1 },
              }}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.total_pages}
            asChild
          >
            <Link
              href={{
                pathname: "/search",
                query: { q: query, page: page + 1 },
              }}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const title = result.title || result.name;
  const date = result.release_date || result.first_air_date;
  const link =
    result.media_type === "movie" ? `/movie/${result.id}` : `/tv/${result.id}`;

  return (
    <Link href={link} className="group">
      <div className="bg-card rounded-lg overflow-hidden border border-border/50 transition-colors hover:border-primary/50">
        <div className="relative aspect-[2/3]">
          {result.poster_path ? (
            <Image
              src={getImageUrl(result.poster_path)!}
              alt={title || ""}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date ? new Date(date).getFullYear() : "N/A"}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              {result.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const page = Number(searchParams.page) || 1;

  if (!query) {
    return (
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Search</h1>
          <p className="text-lg text-muted-foreground">
            Enter a search term to find movies and TV shows.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">
          Search results for &quot;{query}&quot;
        </h1>
        <Suspense
          fallback={
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-lg overflow-hidden border border-border/50 animate-pulse"
                  >
                    <div className="relative aspect-[2/3] bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-6">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-9 w-24 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          }
        >
          <SearchResults query={query} page={page} />
        </Suspense>
      </div>
    </main>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
// import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Film, Search, Bell, User, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { searchMulti, SearchResult } from "@/lib/tmdb";
import { getImageUrl } from "@/lib/utils";

export function MainNav() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (query.trim()) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    setLoading(true);
    searchMulti(query)
      .then((data) => {
        setResults(data.results?.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    const path = result.media_type === "movie" ? "/movie" : "/tv";
    router.push(`${path}/${result.id}`);
  };
  return (
    <div className="fixed top-0 w-full z-50 bg-gradient-to-b from-background to-background/0 backdrop-blur-sm border-b border-border/50 overflow-visible">
      <div className="container flex h-16 items-center justify-center px-4 overflow-visible">
        <Link href="/" className="flex items-center mr-6 gap-1">
          <Film className="h-6 w-6" />
          <span className="font-bold text-xl">NextFlix</span>
        </Link>
        <div className=" flex items-center justify-between w-full overflow-visible">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/tv" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    TV Shows
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/movies" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Movies
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/new" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    New & Popular
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className=" flex items-center gap-4 overflow-visible">
            <div className="relative z-20">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white" />
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(e);
                  }
                }}
                className="h-9 w-[300px] z-20 rounded-md border border-input bg-background/30 focus:bg-accent/30 px-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring backdrop-blur-sm"
              />
              {open && (
                <div>
                  <ul className="absolute w-[300px] p-0 px-2 gap-4 z-20 bg-background border border-border rounded-md mt-1 ">
                    {loading ? (
                      <li className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </li>
                    ) : results.length > 0 ? (
                      <div className="py-2">
                        {results.map((result) => (
                          <li
                            key={`${result.media_type}-${result.id}`}
                            onClick={() => handleSelect(result)}
                            className="flex items-center gap-3 w-full mb-2 px-4 py-2 text-sm hover:bg-accent/60 backdrop-blur-sm cursor-pointer rounded"
                          >
                            <div className="relative h-12 w-8 flex-none overflow-hidden rounded">
                              {result.poster_path ? (
                                <Image
                                  src={getImageUrl(result.poster_path)!}
                                  alt={result.title || result.name || ""}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                  <span className="text-xs text-muted-foreground">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {result.title || result.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {result.media_type === "movie"
                                  ? "Movie"
                                  : "TV Show"}{" "}
                                •{" "}
                                {new Date(
                                  result.release_date ||
                                    result.first_air_date ||
                                    "",
                                ).getFullYear() || "N/A"}
                              </span>
                            </div>
                          </li>
                        ))}
                        {query.trim() && (
                          <li
                            onClick={handleSubmit}
                            className="w-full px-4 py-2 text-sm font-medium text-primary hover:bg-accent text-center cursor-pointer"
                          >
                            View all results
                          </li>
                        )}
                      </div>
                    ) : query.trim() ? (
                      <li className="px-4 py-6 text-sm text-center text-muted-foreground">
                        No results found
                      </li>
                    ) : null}
                  </ul>
                  <div
                    className="fixed top-0 left-0 right-0 bottom-0 w-[100vw] h-[100vh] z-10 bg-transparent"
                    onClick={() => setOpen(false)}
                  ></div>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

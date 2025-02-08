"use server";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
  vote_count: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  vote_count: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
  season_number: number;
}

export interface SeasonDetails extends Season {
  episodes: Episode[];
}

export interface TvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  first_air_date: string;
}

export interface TvShowDetails extends TvShow {
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
}

async function fetchFromTMDB<T>(
  endpoint: string,
  queryParams: Record<string, string> = {},
): Promise<T> {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY!,
      language: "en-US",
      ...queryParams,
    });

    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${params}`, {
      ...(process.env.DOCKER ? { next: { revalidate: 3600 } } : {}),
    });
    console.log(response.status);

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    throw new Error("Failed to fetch data");
  }
}

export async function getMovieById(id: string): Promise<MovieDetails> {
  const data = await fetchFromTMDB<MovieDetails>(`/movie/${id}`);
  return data as MovieDetails;
}

export async function getTvShowById(id: string): Promise<TvShowDetails> {
  const data = await fetchFromTMDB<TvShowDetails>(`/tv/${id}`);
  return data as TvShowDetails;
}

export async function getSeasonDetails(
  showId: string,
  seasonNumber: string,
): Promise<SeasonDetails> {
  const data = await fetchFromTMDB<SeasonDetails>(
    `/tv/${showId}/season/${seasonNumber}`,
  );
  return data as SeasonDetails;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  console.log("getting trending movies...");

  const data = await fetchFromTMDB<{ results: Movie[] }>(
    "/trending/movie/week",
  );
  return data.results as Movie[];
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: Movie[] }>("/movie/popular");
  return data.results as Movie[];
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: Movie[] }>("/movie/top_rated");
  return data.results as Movie[];
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<{ results: Movie[] }>("/movie/upcoming");
  return data.results as Movie[];
}

export async function getPopularTvShows(): Promise<TvShow[]> {
  const data = await fetchFromTMDB<{ results: TvShow[] }>("/tv/popular");
  return data.results as TvShow[];
}

export async function getTrendingTvShows(): Promise<TvShow[]> {
  const data = await fetchFromTMDB<{ results: TvShow[] }>("/trending/tv/week");
  return data.results as TvShow[];
}

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

export async function searchMulti(
  query: string,
  page = 1,
): Promise<SearchResponse> {
  try {
    const data = await fetchFromTMDB("/search/multi", {
      query,
      page: page.toString(),
      include_adult: "false",
    });
    return data as SearchResponse;
  } catch {
    return {} as SearchResponse;
  }
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

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

async function fetchFromTMDB(endpoint: string) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("TMDB fetch error:", error);
    throw new Error("Failed to fetch data");
  }
}

export function getImageUrl(
  path: string | null,
  size: "w500" | "original" = "w500",
) {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export async function getMovieById(id: string): Promise<MovieDetails> {
  const data = await fetchFromTMDB(`/movie/${id}`);
  return data as MovieDetails;
}

export async function getTvShowById(id: string): Promise<TvShowDetails> {
  const data = await fetchFromTMDB(`/tv/${id}`);
  return data as TvShowDetails;
}

export async function getSeasonDetails(
  showId: string,
  seasonNumber: string,
): Promise<SeasonDetails> {
  const data = await fetchFromTMDB(`/tv/${showId}/season/${seasonNumber}`);
  return data as SeasonDetails;
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = (await fetchFromTMDB("/trending/movie/week")) as {
    results: Movie[];
  };
  return data.results;
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = (await fetchFromTMDB("/movie/popular")) as {
    results: Movie[];
  };
  return data.results;
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = (await fetchFromTMDB("/movie/top_rated")) as {
    results: Movie[];
  };
  return data.results;
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  const data = (await fetchFromTMDB("/movie/upcoming")) as {
    results: Movie[];
  };
  return data.results;
}

export async function getPopularTvShows(): Promise<TvShow[]> {
  const data = (await fetchFromTMDB("/tv/popular")) as {
    results: TvShow[];
  };
  return data.results;
}

export async function getTrendingTvShows(): Promise<TvShow[]> {
  const data = (await fetchFromTMDB("/trending/tv/week")) as {
    results: TvShow[];
  };
  return data.results;
}

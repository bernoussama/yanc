export type Provider = "vidsrc" | "2embed";

interface ProviderOptions {
  type: "movie" | "tv";
  id: string; // TMDB ID
  imdbId?: string; // IMDB ID (optional, but recommended for 2embed)
  seasonNumber?: string;
  episodeNumber?: string;
}

export function getEmbedUrl(
  provider: Provider,
  options: ProviderOptions,
): string {
  switch (provider) {
    case "2embed":
      return get2EmbedUrl(options);
    case "vidsrc":
      return getVidSrcUrl(options);
    default:
      return get2EmbedUrl(options);
  }
}

function get2EmbedUrl(options: ProviderOptions): string {
  const {
    type = "movie",
    id,
    imdbId = "",
    seasonNumber = "",
    episodeNumber = "",
  } = options;

  // Trim all string values
  const trimmedId = id.trim();
  const trimmedImdbId = imdbId.trim();
  const trimmedSeasonNumber = seasonNumber.trim();
  const trimmedEpisodeNumber = episodeNumber.trim();

  const baseUrl = "https://www.2embed.cc";

  if (type === "movie") {
    const embedType = trimmedImdbId
      ? `embed/${trimmedImdbId}`
      : `embed/${trimmedId}`;
    return `${baseUrl}/${embedType}`;
  } else {
    if (trimmedSeasonNumber && trimmedEpisodeNumber) {
      const embedType = trimmedImdbId
        ? `embedtv/${trimmedImdbId}`
        : `embedtv/${trimmedId}`;
      return `${baseUrl}/${embedType}&s=${trimmedSeasonNumber}&e=${trimmedEpisodeNumber}`;
    } else {
      // Embed Complete TV Seasons
      const embedType = trimmedImdbId
        ? `embedtvfull/${trimmedImdbId}`
        : `embedtvfull/${trimmedId}`;
      return `${baseUrl}/${embedType}`;
    }
  }
}

function getVidSrcUrl(options: ProviderOptions): string {
  const { type = "movie", id, seasonNumber = "", episodeNumber = "" } = options;

  // Trim all string values
  const trimmedId = id.trim();
  const trimmedSeasonNumber = seasonNumber.trim();
  const trimmedEpisodeNumber = episodeNumber.trim();

  const baseUrl = `https://vidsrc.xyz/embed/${type === "tv" ? "tv" : "movie"}`;

  if (type === "movie") {
    return `${baseUrl}/${trimmedId}`;
  } else {
    if (trimmedSeasonNumber && trimmedEpisodeNumber) {
      return `${baseUrl}/${trimmedId}/${trimmedSeasonNumber}-${trimmedEpisodeNumber}`;
    } else {
      return `${baseUrl}/${trimmedId}/${trimmedSeasonNumber}`;
    }
  }
}

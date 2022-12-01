import { MovieSummary } from "./interfaces";

const baseUrl = `https://api.themoviedb.org/3`;
const apiKey = `api_key=${process.env.NEXT_PUBLIC_MOVIEDB_API_KEY}`;

interface PaginatedResult<T> {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
}

export const getDiscoverMovies = async () => {
  const res = await fetch(`${baseUrl}/discover/movie?${apiKey}`);
  return await res.json() as PaginatedResult<MovieSummary>;
}

export const searchMovies = async (search: string) => {
  const res = await fetch(`${baseUrl}/search/movie?query=${search}&${apiKey}`);
  return await res.json() as PaginatedResult<MovieSummary>;
}

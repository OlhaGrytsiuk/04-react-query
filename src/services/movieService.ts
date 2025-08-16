import axios from 'axios';
import type { Movie } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1';

interface FetchMoviesParams {
  query: string;
}

interface FetchMoviesResponse {
  results: Movie[];
}

export async function fetchMovies({ query }: FetchMoviesParams): Promise<Movie[]> {
   const response = await axios.get<FetchMoviesResponse>(API_URL, {
  params: { query },
  headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
}});
  return response.data.results;
}

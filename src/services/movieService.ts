import axios from 'axios';
import type { MoviesResponse } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1';

export async function fetchMovies(query: string, page: number): Promise<MoviesResponse> {
   const response = await axios.get<MoviesResponse>(API_URL, {
  params: { query,  page, },
  headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
}});
  return response.data;
}
